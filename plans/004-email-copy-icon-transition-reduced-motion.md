# Plan 004: Refine Email Copy Icon Morph and Add Reduced Motion Guard

- **Target Commit**: `b2ef254`
- **Category**: Physicality & Accessibility
- **Severity**: MEDIUM
- **File**: `src/components/EmailContactLink.tsx`

---

## 1. Context & Motivation

In `src/components/EmailContactLink.tsx`:
1. The copy button uses `whileHover={{ scale: 1.08 }}` and `whileTap={{ scale: 0.92 }}` without checking `useReducedMotion()`.
2. The hover scale `1.08` is disproportionately large for an inline utility button.
3. The icon morph between `Copy` and `Check` uses asymmetric initial/exit scales:
   * Check icon: `initial={{ scale: 0.5, opacity: 0 }}`
   * Copy icon: `initial={{ scale: 0.8, opacity: 0 }}`
   When copying email, the checkmark pops aggressively from 50% scale, while the copy icon exits to 80% scale.

---

## 2. Target Specification

* **Reduced Motion**: Import and check `useReducedMotion()`. When active, disable all scale transitions (`scale: 1` or `undefined`).
* **Button Hover Scale**: Refine to `1.04` on hover and `0.96` on tap (subtle micro-press).
* **Icon Morph Scale**: Symmetrically set `scale: 0.85` for both `Check` and `Copy` icons during initial and exit states.
* **Duration**: `0.15s`, `ease: [0.16, 1, 0.3, 1]`.

---

## 3. Current Code Excerpt

Location: `src/components/EmailContactLink.tsx` lines 56–90:

```tsx
      {/* Tactile Copy Button with Microinteraction */}
      <motion.button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Email copied to clipboard' : 'Copy email to clipboard'}
        title={copied ? 'Copied!' : 'Copy email'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="relative inline-flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-emerald-600 dark:text-emerald-400"
            >
              <Check size={14} weight="bold" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <Copy size={14} weight="regular" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
```

---

## 4. Required Changes

1. In imports:
```tsx
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
```

2. Inside `EmailContactLink`:
```tsx
const shouldReduceMotion = useReducedMotion();
```

3. Update `whileHover`, `whileTap`, and icon variants:
```tsx
      <motion.button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Email copied to clipboard' : 'Copy email to clipboard'}
        title={copied ? 'Copied!' : 'Copy email'}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative inline-flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="text-emerald-600 dark:text-emerald-400"
            >
              <Check size={14} weight="bold" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              <Copy size={14} weight="regular" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
```

---

## 5. Scope Boundaries

* **DO NOT** change copy-to-clipboard logic or toast/sound behaviors.
* **DO NOT** modify the email link text or underline styling.

---

## 6. Verification & Feel-Check

1. Hover over the copy button: verify subtle `1.04x` lift without jarring enlargement.
2. Click the copy button: observe the checkmark transition smoothly from `0.85` scale and 0 opacity to full lock.
3. Test with `prefers-reduced-motion: reduce`: confirm zero scaling, immediate clean crossfade.
