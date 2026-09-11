# Plan 003: Synchronize Accordion Caret Rotation and Height Duration

- **Target Commit**: `b2ef254`
- **Category**: Cohesion & Tokens / Interruptibility
- **Severity**: HIGH
- **Files**:
  * `src/components/ProjectCard.tsx`
  * `src/components/ExperienceTimeline.tsx`

---

## 1. Context & Motivation

In both `ProjectCard.tsx` and `ExperienceTimeline.tsx`, accordion drawers use two conflicting duration and easing specs:
* The chevron icon rotates with `duration-300 ease-[cubic-bezier(0.2,0,0,1)]` (CSS Tailwind transition).
* The collapsible content height animates with `duration: 0.2, ease: [0.16, 1, 0.3, 1]` (Framer Motion).

This creates a 100ms lag where the height animation has already completed, but the chevron icon is still rotating. The two visual elements should begin, travel, and settle together synchronously.

---

## 2. Target Specification

* **Duration**: `200ms` (`duration-200` in Tailwind, `0.2` in Framer Motion)
* **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` for both icon rotation and height change
* **Reduced Motion**: Instant transition (`0ms` duration, `rotate-180` / `rotate-0` state switch without animation).

---

## 3. Current Code Excerpt

### File 1: `src/components/ProjectCard.tsx` (lines 106–127)

```tsx
          <CaretDown
            size={16}
            weight="bold"
            className={`transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
      </div>

      {/* 3. Collapsible Lower Content (Tech Stack, Bullets, Links) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={contentId}
            key="expanded-details"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            }
            className="overflow-hidden"
          >
```

### File 2: `src/components/ExperienceTimeline.tsx` (lines 86–117)

```tsx
                    <CaretDown
                      size={16}
                      weight="bold"
                      className={`transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </span>
                </div>
              </button>

              {/* Short One-Line Summary */}
              <p className="text-[14.5px] sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1 sm:mt-1.5 text-pretty">
                {exp.summary}
              </p>

              {/* Collapsible Expanded Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    id={contentId}
                    key="expanded-content"
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                    }
                    className="overflow-hidden"
                  >
```

---

## 4. Required Changes

In both `src/components/ProjectCard.tsx` (line 106) and `src/components/ExperienceTimeline.tsx` (line 89):

Change:
```tsx
className={`transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
  isExpanded ? 'rotate-180' : 'rotate-0'
}`}
```

To:
```tsx
className={`transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
  isExpanded ? 'rotate-180' : 'rotate-0'
}`}
```

---

## 5. Scope Boundaries

* **DO NOT** modify any card contents, tech stacks, or link behaviors.
* **DO NOT** alter the expanded state persistence or IDs.

---

## 6. Verification & Feel-Check

1. Click any Project Card expand button; observe the caret rotation and height reveal.
2. Confirm the chevron rotation begins and settles at the exact millisecond the drawer finishes expanding.
3. Click to collapse; confirm symmetric closure synchronization.
