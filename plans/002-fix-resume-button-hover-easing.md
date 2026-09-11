# Plan 002: Fix ResumeButton Hover Easing and Transition Scope

- **Target Commit**: `b2ef254`
- **Category**: Easing & Duration / Performance
- **Severity**: HIGH
- **File**: `src/components/ResumeButton.tsx`

---

## 1. Context & Motivation

In `src/components/ResumeButton.tsx`:
1. The default text layer leaves on hover using `ease-in` (`transition-all duration-200 ease-in`). `ease-in` has near-zero initial acceleration, creating a perceivable lag when the cursor enters the button.
2. Both layers use unbounded `transition-all`, which forces the browser to evaluate every animatable CSS property during hover and unhover.
3. The hover slide-up layer uses `duration-250`, which diverges from the system duration scale (`--duration-fast: 150ms`, `--duration-normal: 200ms`, `--duration-slow: 300ms`).

---

## 2. Target Specification

* **Layer 1 (Default Text)**:
  * Transition properties: `transition-[transform,opacity]` (NOT `transition-all`)
  * Duration: `duration-200` (`200ms`)
  * Easing: `ease-[cubic-bezier(0.16,1,0.3,1)]` or `ease-out` (prompt exit, no initial sluggishness)
* **Layer 2 (Slide-up Hover Layer)**:
  * Transition properties: `transition-[transform,opacity]` (NOT `transition-all`)
  * Duration: `duration-200` (`200ms`, aligned with Layer 1)
  * Easing: `ease-[cubic-bezier(0.16,1,0.3,1)]` (smooth arrival)

---

## 3. Current Code Excerpt

Location: `src/components/ResumeButton.tsx` lines 53–74:

```tsx
        {/* Default Layer (Leaves on hover: ease-in) */}
        <span className="inline-flex items-center gap-1.5 transition-all duration-200 ease-in group-hover:-translate-y-8 group-hover:opacity-0">
          <span>resume</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="translate-y-[0.5px]"
            aria-hidden="true"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
        </span>

        {/* Hover Slide-up Layer (Enters from bottom: ease-out) */}
        <div
          className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 transition-all duration-250 ease-out translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden="true"
        >
```

---

## 4. Required Changes

Replace lines 53–74 in `src/components/ResumeButton.tsx` with:

```tsx
        {/* Default Layer (Leaves on hover promptly with cubic-bezier) */}
        <span className="inline-flex items-center gap-1.5 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-8 group-hover:opacity-0">
          <span>resume</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="translate-y-[0.5px]"
            aria-hidden="true"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
        </span>

        {/* Hover Slide-up Layer (Enters synchronously from bottom in 200ms) */}
        <div
          className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden="true"
        >
```

---

## 5. Scope Boundaries

* **DO NOT** change the shake animation or `showLockedFeedback` tooltip.
* **DO NOT** change the button styling, borders, colors, or click handler.

---

## 6. Verification & Feel-Check

1. Hover in and out of the "resume" button rapidly.
2. Verify that the transition responds immediately on mouseenter with zero latency.
3. Verify that both the exiting text and entering black/white pill move in lockstep at exactly 200ms.
