# Motion & Animation Improvement Plans

This directory contains implementation plans produced by the `improve-animations` audit. Each plan is self-contained with exact file paths, current code excerpts, target specifications, and feel-check verification steps.

## Plan Catalog & Execution Roadmap

| Plan ID | Title | Severity | Target File | Status |
|---|---|---|---|---|
| [001-fix-tooltip-scale-zero.md](001-fix-tooltip-scale-zero.md) | Fix Tooltip Content Scaling from Zero | HIGH | `src/components/animate-ui/primitives/animate/tooltip.tsx` | Completed |
| [002-fix-resume-button-hover-easing.md](002-fix-resume-button-hover-easing.md) | Fix ResumeButton Hover Easing and Transition Scope | HIGH | `src/components/ResumeButton.tsx` | Completed |
| [003-synchronize-accordion-chevron-motion.md](003-synchronize-accordion-chevron-motion.md) | Synchronize Accordion Caret Rotation and Height Duration | HIGH | `src/components/ProjectCard.tsx`<br>`src/components/ExperienceTimeline.tsx` | Completed |
| [004-email-copy-icon-transition-reduced-motion.md](004-email-copy-icon-transition-reduced-motion.md) | Refine Email Copy Icon Morph & Add Reduced Motion | MEDIUM | `src/components/EmailContactLink.tsx` | Completed |

## Recommended Execution Order

1. **Plan 001**: Immediate fix to the global tooltip primitive to eliminate the jarring `scale(0)` ballooning across all icons and badges.
2. **Plan 002**: High-impact fix to the prominent interactive resume button on the homepage, eliminating sluggish `ease-in` and `transition-all`.
3. **Plan 003**: Synchronizes the drawer height expansion and caret rotation across both Projects and Experience pages.
4. **Plan 004**: Polishes the tactile microinteraction and accessibility of the primary contact copy button.

## Dependencies

* There are **no cross-plan dependencies**. Each plan modifies an independent component file and can be executed independently or in parallel.

## How to Execute

To execute any plan:
* Run with the command: `improve-animations execute plans/<plan-name>.md`
* Or dispatch any coding agent directly to the self-contained plan file.
