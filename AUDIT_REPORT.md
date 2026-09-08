# Workfolio audit report

Audit date: 2026-09-08. Scope: the tracked Next.js application and its static-export artifact configuration. The audit branch is `audit-cleanup`; `audit/cleanup` could not be created because the pre-existing `audit` ref occupies that Git namespace.

## 1. Executive summary

1. **High — production mode cannot support the application runtime.** The GitHub Pages workflow deploys `out/` as a static site ([deploy.yml](.github/workflows/deploy.yml#L46)), while the app requires request-time middleware and API route handlers ([middleware.ts](src/middleware.ts#L6), [route.ts](src/app/api/github-contributions/route.ts#L219)). Static exports do not support middleware or request-time routes, so Markdown negotiation and live activity/quote endpoints are unavailable after deployment.
2. **High — an Upstash Redis credential can be exposed to every visitor.** Client code reads `NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN` and sends it as a bearer token ([viewsClient.ts](src/lib/viewsClient.ts#L11), [viewsClient.ts](src/lib/viewsClient.ts#L20)). If configured, Next.js inlines it in the browser bundle, allowing public read/write access to the counter key and potentially the Redis database.
3. **Medium — unauthenticated public endpoints proxy third-party services with no input limit, origin policy, or rate limit.** The GitHub and LeetCode routes accept arbitrary `username` values ([github-contributions/route.ts](src/app/api/github-contributions/route.ts#L221), [leetcode-contributions/route.ts](src/app/api/leetcode-contributions/route.ts#L140)); each can cause multiple upstream requests. This enables avoidable quota/cost pressure when the app is moved to a server runtime.
4. **Medium — external requests have no timeout.** The activity and quote handlers await external fetches without an abort signal ([coding-stats/route.ts](src/app/api/coding-stats/route.ts#L85), [quotes/route.ts](src/app/api/quotes/route.ts#L20)). A stalled upstream can retain server resources until the host terminates the request.
5. **Medium — analytics records automatic interaction data and enables session recording by default.** PostHog uses a hard-coded project key and has `autocapture: true` plus `disable_session_recording: false` ([posthog.ts](src/lib/posthog.ts#L3), [posthog.ts](src/lib/posthog.ts#L19)). This needs an explicit consent/privacy decision before production use.

## 2. Dead code inventory

Full-repository import searches found the following items referenced only by their own declaration (or, for assets, by no tracked source). They are safe to remove after this report.

| File | Line | Type | Confidence | Recommendation |
| --- | ---: | --- | --- | --- |
| `src/components/VerseCards.tsx` | 68 | Orphan component | Certain | Remove |
| `src/components/BlogStackingCards.tsx` | 138 | Orphan component | Certain | Remove |
| `src/components/SwitchMode.tsx` | 21 | Orphan component | Certain | Remove |
| `src/components/core/morphing-dialog.tsx` | 36 | Orphan component family | Certain | Remove |
| `src/components/ui/button.tsx` | 11 | Orphan UI primitive | Certain | Remove |
| `src/components/ui/input.tsx` | 8 | Orphan UI primitive | Certain | Remove |
| `src/components/ui/label.tsx` | 8 | Orphan UI primitive | Certain | Remove |
| `src/lib/viewsDb.ts` | 51 | Unreachable server-side counter implementation | Certain | Remove; no route imports it |
| `public/images/projects/Numecaiq.gif` | — | Byte-identical unreferenced asset | Certain | Remove; `NUmercaiq.gif` is referenced |
| `public/images/projects/favicon.png` | — | Byte-identical unreferenced asset | Certain | Remove; root `favicon.png` is referenced |
| `package.json` | 16, 20 | Unused dependencies `@types/gsap`, `lucide-react` | Certain | Remove |

No commented-out executable code or `debugger` statements were found. Intentional `console.error`/`console.warn` calls are error telemetry and were retained. No missing declared dependency was found from import inspection.

## 3. Bugs found

| Severity | Finding and reproduction | Root cause |
| --- | --- | --- |
| High | Deploy the current `main` workflow to GitHub Pages, then open the home page: `/api/github-contributions/`, `/api/leetcode-contributions/`, and `/api/quotes/` cannot be request-time handlers; content negotiation in middleware cannot run. | Static export in [next.config.ts](next.config.ts#L20) conflicts with the static host workflow and runtime features. |
| Medium | Set `NEXT_PUBLIC_UPSTASH_REDIS_REST_URL` and `NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN`, load `/`, inspect network requests or JS: a visitor receives the Redis bearer token and can replay increment/get calls. | Server credential is deliberately read by client code in [viewsClient.ts](src/lib/viewsClient.ts#L11). |
| Medium | Open the site while an upstream API hangs. The activity/quote component remains loading and a server deployment holds the associated request open. | No `AbortSignal.timeout`/cancellation is supplied to upstream fetches. |
| Low | Click the home-page Resume control. Expected: navigate to `portfolioData.socials.resumeUrl`; actual: it is a disabled button and its `href` prop is unused. | [ResumeButton.tsx](src/components/ResumeButton.tsx#L10) destructures then suppresses the unused `href` parameter and renders `disabled`. This may be intentional while the resume is withheld. |

Effects and intervals in the inspected interactive components clean up their event listeners/timers. Client fetches use cancellation guards; no confirmed leak was found.

## 4. Performance findings

Baseline lint fails with 15 errors and 10 warnings, all in pre-existing files outside this cleanup batch. The highest-signal items are synchronous state updates inside effects ([SoundProvider.tsx](src/components/SoundProvider.tsx#L26), [ThemeProvider.tsx](src/components/ThemeProvider.tsx#L72)), `any` types ([ThoughtSection.tsx](src/components/ThoughtSection.tsx#L33), [posthog.ts](src/lib/posthog.ts#L36)), and third-party-derived UI primitives that violate new React lint rules. The existing test suite passed **54/54** both before and after cleanup. The build could not complete in this offline environment because `next/font/google` could not fetch Urbanist ([layout.tsx](src/app/layout.tsx#L2)); failed attempts took 2.12 s before cleanup and 2.92 s after. The build also emitted Next 16's middleware-to-proxy deprecation warning for [middleware.ts](src/middleware.ts#L1).

The pre-existing `out/` artifact measures **12,418,144 bytes** total; its JS/CSS chunks measure **1,312,411 bytes**. No before/after bundle comparison is available because the production build could not reach Google Fonts.

| Priority | Finding | Evidence | Recommendation |
| --- | --- | --- |
| High | Startup depends on a build-time Google Fonts fetch. | [layout.tsx](src/app/layout.tsx#L2) | Self-host the font or ensure CI has reliable outbound access. |
| Medium | Two 1.63 MB duplicated favicons and two 0.86 MB duplicated GIFs inflate the static artifact. | `public/favicon.png`, `public/images/projects/favicon.png`, and the two `*mercaiq.gif` files | Remove the unreferenced duplicates in cleanup. |
| Medium | LeetCode refreshes every 60 seconds and triggers parallel fallback chains. | [LeetCodeContributions.tsx](src/components/LeetCodeContributions.tsx#L271), [leetcode-contributions/route.ts](src/app/api/leetcode-contributions/route.ts#L159) | Poll less often or only on visibility/focus; cache on the server. |
| Low | Custom cursor, analytics, sound provider, navigation popover, and heatmaps are loaded under the root client boundary. | [layout.tsx](src/app/layout.tsx#L211) | Consider lazy-loading nonessential enhancements after initial interaction. |

Lighthouse was not run: no successful production server/artifact was available due to the font fetch failure, so reporting a score would be misleading.

## 5. Architecture notes

The project is Next.js 16.3.1 with React 19, TypeScript, Tailwind 4, ESLint, npm lockfile, App Router route handlers, and a GitHub Pages deployment workflow. It is configured for static export outside development ([next.config.ts](next.config.ts#L20)); the CNAME and workflow identify GitHub Pages as the intended production target.

UI components, data, and libraries are generally separated cleanly. The main scaling concern is duplicated responsibility: client components directly call third-party APIs as fallbacks while route handlers do the same, and static-host deployment is mixed with Node/server-only files. Choose either a static architecture (client-safe public APIs only, no middleware/routes/secrets) or a server-capable host with a single backend data boundary.

## 6. Security findings

| Severity | Finding | Evidence |
| --- | --- | --- |
| High | Potential public Redis token exposure through `NEXT_PUBLIC_*` variables. Rotate any token that has been deployed, remove client access, and proxy counter operations through a rate-limited server endpoint. | [viewsClient.ts](src/lib/viewsClient.ts#L11) |
| Medium | Public third-party proxy routes have no rate limiting, request validation length limit, or explicit abuse controls. | [github-contributions/route.ts](src/app/api/github-contributions/route.ts#L219), [leetcode-contributions/route.ts](src/app/api/leetcode-contributions/route.ts#L140) |
| Medium | Session recording/autocapture is enabled without visible consent gating. | [posthog.ts](src/lib/posthog.ts#L19) |
| Low | No hosting security-header configuration is present (CSP, HSTS, frame protection). GitHub Pages must supply headers via its platform or an edge proxy. | [deploy.yml](.github/workflows/deploy.yml#L1) |
| Low | API error bodies return raw upstream error messages. | [quotes/route.ts](src/app/api/quotes/route.ts#L86), [leetcode-contributions/route.ts](src/app/api/leetcode-contributions/route.ts#L255) |

No committed `.env` files, private keys, GitHub PATs, or similar secrets were found. `npm audit` reported **0 vulnerabilities** in 466 installed dependencies (including dev dependencies). The PostHog project key is public by design but should still be kept configurable rather than treated as a secret.

## 7. Changes made in this session

- Created the non-conflicting `audit-cleanup` branch. (`audit/cleanup` is impossible while the `audit` branch exists.)
- Removed the eight cataloged orphan source files: `VerseCards`, `BlogStackingCards`, `SwitchMode`, `morphing-dialog`, the `button`/`input`/`label` primitives, and `viewsDb`.
- Removed the two cataloged byte-identical unreferenced assets: `Numecaiq.gif` and `images/projects/favicon.png`.
- Removed the unused `lucide-react` and `@types/gsap` packages and refreshed `package-lock.json`.

Verification after cleanup: source/asset full-text searches still find no references to removed items; `npm run test` passes 54/54. `npm run lint` still fails only on pre-existing code outside this cleanup, and `npm run build` remains blocked by the environment's Google Fonts network failure.
