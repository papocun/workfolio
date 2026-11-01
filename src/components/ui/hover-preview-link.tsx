"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Hover preview link adapted from ui lab (lab.xevrion.dev/lab/hover-preview-link).
// Hover a link to get a preview card that trails the cursor and leans as it moves.

const CARD_W = 232;
const GAP = 10;
const GUTTER = 8;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
// Loose enough that the card visibly trails the cursor, tight enough that
// it never feels like it is swimming.
const FOLLOW = { stiffness: 260, damping: 26, mass: 0.6 } as const;
// A card dragged sideways leans into the motion; 7deg at a brisk flick is
// noticeable without looking like it will fall off.
const MAX_TILT = 7;
const TILT_AT_SPEED = 1400;
// Holds the card up after a touch press ends, so it can actually be read.
const TOUCH_LINGER = 1400;

type Mode = "cursor" | "anchored";

export function HoverPreviewLink({
  href,
  title,
  domain,
  image,
  children,
  className = "",
  onClick,
}: {
  href: string;
  title: string;
  domain: string;
  image: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const wrap = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<Mode | null>(null);
  const [below, setBelow] = useState(false);
  const linger = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // x is the card's left edge relative to the link, raw from the pointer;
  // the spring gives it lag and its velocity drives the lean.
  const targetX = useMotionValue(0);
  const x = useSpring(targetX, FOLLOW);
  const speed = useVelocity(x);
  const tilt = useSpring(
    useTransform(speed, [-TILT_AT_SPEED, TILT_AT_SPEED], [MAX_TILT, -MAX_TILT], {
      clamp: true,
    }),
    { stiffness: 400, damping: 30 },
  );

  useEffect(() => () => clearTimeout(linger.current), []);

  // Keeps the card inside the viewport so it can't widen a phone page.
  const clampLeft = (left: number) => {
    const el = wrap.current;
    if (!el) return left;
    const r = el.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const min = GUTTER - r.left;
    const max = vw - GUTTER - r.left - CARD_W;
    return Math.round(Math.min(Math.max(left, min), Math.max(min, max)));
  };

  const place = (mode: Mode, clientX?: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const centre =
      mode === "cursor" && clientX !== undefined ? clientX - r.left : el.offsetWidth / 2;
    return clampLeft(centre - CARD_W / 2);
  };

  const show = (mode: Mode, clientX?: number) => {
    const el = wrap.current;
    const left = place(mode, clientX);
    if (!el || left === undefined) return;
    clearTimeout(linger.current);
    // Flip below when there isn't room above in the viewport.
    setBelow(el.getBoundingClientRect().top < 200);
    if (!open) {
      // Appears where the pointer is, rather than sliding in from the last spot.
      targetX.jump(left);
      x.jump(left);
      tilt.jump(0);
    } else {
      targetX.set(left);
    }
    setOpen(mode);
  };

  const hide = () => {
    clearTimeout(linger.current);
    setOpen(null);
  };

  return (
    <span ref={wrap} className="relative inline-block">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        onPointerEnter={(e) => {
          if (e.pointerType !== "touch") show("cursor", e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "touch" || !open) return;
          if (reduceMotion) return;
          targetX.set(place("cursor", e.clientX) ?? 0);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "touch") hide();
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") show("anchored");
        }}
        onPointerUp={(e) => {
          if (e.pointerType !== "touch") return;
          clearTimeout(linger.current);
          linger.current = setTimeout(hide, TOUCH_LINGER);
        }}
        onPointerCancel={hide}
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) show("anchored");
        }}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === "Escape") hide();
        }}
        className={`rounded-[2px] outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-[#1D9BF0] ${className}`}
      >
        {children}
      </a>

      <AnimatePresence>
        {open ? (
          <motion.span
            aria-hidden
            className={`pointer-events-none absolute left-0 z-50 block ${
              below ? "top-full" : "bottom-full"
            }`}
            style={{
              x,
              rotate: reduceMotion ? 0 : tilt,
              width: CARD_W,
              paddingTop: below ? GAP : 0,
              paddingBottom: below ? 0 : GAP,
              // Pivots at the edge nearest the link, like it is held there.
              transformOrigin: below ? "50% 0%" : "50% 100%",
            }}
          >
            <motion.span
              className="block overflow-hidden rounded-xl bg-white p-1 text-left font-normal shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.06),0_6px_16px_-6px_rgba(0,0,0,0.12)] dark:bg-[#16181C] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4),0_6px_16px_-6px_rgba(0,0,0,0.6)]"
              style={{ transformOrigin: below ? "50% 0%" : "50% 100%" }}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.88, y: below ? -6 : 6, filter: "blur(4px)" }
              }
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.18, ease: EASE_OUT },
              }}
              exit={{
                opacity: 0,
                scale: reduceMotion ? 1 : 0.96,
                filter: reduceMotion ? "blur(0px)" : "blur(2px)",
                transition: { duration: 0.12, ease: EASE_OUT },
              }}
            >
              {/* Concentric: 12px card = 8px image + 4px padding. */}
              <span className="block h-[104px] overflow-hidden rounded-lg bg-slate-100 outline outline-1 -outline-offset-1 outline-black/10 dark:bg-slate-800 dark:outline-white/10">
                {image}
              </span>
              <span className="block px-2 pt-2 pb-1.5">
                <span className="block truncate text-[13px] font-medium text-slate-900 dark:text-slate-100">
                  {title}
                </span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                  {domain}
                </span>
              </span>
            </motion.span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
