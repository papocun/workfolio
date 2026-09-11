# Plan 001: Fix Tooltip Content Scaling from Zero

- **Target Commit**: `b2ef254`
- **Category**: Physicality & Origin
- **Severity**: HIGH
- **File**: `src/components/animate-ui/primitives/animate/tooltip.tsx`

---

## 1. Context & Motivation

In `src/components/animate-ui/primitives/animate/tooltip.tsx`, the tooltip content enters and exits using `scale: 0`:
```tsx
initial={
  shouldReduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0,
        ...initialFromSide(rendered.data.side),
      }
}
```
Scaling from `0` creates an exaggerated, cartoon-like expansion (ballooning from an infinitely small point), violating modern interface craft standards. Micro-UI elements like tooltips and popovers should enter from a subtle scale (`0.95` or `0.96`) paired with opacity, giving the illusion of depth without distracting motion.

---

## 2. Target Specification

* **Initial Scale**: `0.95` (when `shouldReduceMotion` is false)
* **Exit Scale**: `0.95` (when `shouldReduceMotion` is false)
* **Duration**: Keep existing `0.15s` or use token `--duration-fast: 150ms`
* **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth deceleration)

---

## 3. Current Code Excerpt

Location: `src/components/animate-ui/primitives/animate/tooltip.tsx` lines 317–347:

```tsx
initial={
  shouldReduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0,
        ...initialFromSide(rendered.data.side),
      }
}
animate={
  rendered.open
    ? shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, scale: 1, x: 0, y: 0 }
    : shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 0,
          ...initialFromSide(rendered.data.side),
        }
}
exit={
  shouldReduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0,
        ...initialFromSide(rendered.data.side),
      }
}
```

---

## 4. Required Changes

Replace instances of `scale: 0` in `initial`, `animate` (when closed), and `exit` with `scale: 0.95`:

```tsx
initial={
  shouldReduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.95,
        ...initialFromSide(rendered.data.side),
      }
}
animate={
  rendered.open
    ? shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, scale: 1, x: 0, y: 0 }
    : shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 0.95,
          ...initialFromSide(rendered.data.side),
        }
}
exit={
  shouldReduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.95,
        ...initialFromSide(rendered.data.side),
      }
}
```

---

## 5. Scope Boundaries

* **DO NOT** modify tooltip positioning or offset calculations (`initialFromSide`).
* **DO NOT** change `shouldReduceMotion` fallback logic.
* **DO NOT** touch any other component outside `tooltip.tsx`.

---

## 6. Verification & Feel-Check

1. **Slow-Motion Inspection**: Open Chrome DevTools > More tools > Animations, set throttle to 25%.
2. Hover over any tooltip trigger (e.g. social icons or status tags).
3. Confirm that the tooltip emerges gracefully with subtle opacity and `0.95 -> 1` scale, without ballooning from `scale: 0`.
4. Run `npm run build` and `node scripts/test-agent-readiness.mjs` to ensure clean build.
