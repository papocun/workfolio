"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Binary year adapted from ui lab (lab.xevrion.dev/lab/binary-year), after
// George's personal-site easter egg (https://x.com/vanjek): a year written
// in binary. Reach for it and a wave runs in from the right; each digit
// flickers once and lands, the leading ones fade to quiet zeros, and the
// year you'd recognise types itself in at the end. Leave, and it rolls
// back to binary the other way.

// Between one digit landing and the next starting, in ms: quick enough to
// read as one sweep, slow enough to see it travel.
const STAGGER = 42;
// How long a single digit flickers before it lands, and how often it
// changes while it does.
const FLICKER = 120;
const TICK = 40;

type Look = "rest" | "faint" | "strong" | "live";

export function BinaryYear({
  year = 2026,
  label = "",
  className = "",
}: {
  year?: number;
  label?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [own, setOwn] = useState(false);
  const decoded = own;

  const binary = year.toString(2);
  const width = binary.length;
  const decimal = String(year).padStart(width, "0");
  // The real digits start where the padding stops.
  const firstReal = width - String(year).length;

  const slots = useRef<(HTMLSpanElement | null)[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(false);
  const touched = useRef(false);

  const paint = (i: number, char: string, look: Look) => {
    const el = slots.current[i];
    if (!el) return;
    el.textContent = char;
    el.dataset.look = look;
  };

  useEffect(() => {
    // The first render already shows binary; nothing to animate.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const target = (i: number): [string, Look] =>
      decoded
        ? [decimal[i], i < firstReal ? "faint" : "strong"]
        : [binary[i], "rest"];

    if (reduceMotion) {
      for (let i = 0; i < width; i++) paint(i, ...target(i));
      return;
    }

    // Decoding sweeps in from the right, where the real digits are;
    // encoding goes back from the left.
    for (let n = 0; n < width; n++) {
      const i = decoded ? width - 1 - n : n;
      const start = n * STAGGER;
      for (let t = 0; t < FLICKER; t += TICK) {
        timers.current.push(
          setTimeout(() => {
            // While it flickers, it shows what kind of digit it's
            // becoming: only 0s and 1s on the way back to binary.
            const pool = decoded ? "0123456789" : "01";
            paint(i, pool[Math.floor(Math.random() * pool.length)], "live");
          }, start + t),
        );
      }
      timers.current.push(setTimeout(() => paint(i, ...target(i)), start + FLICKER));
    }
    // binary, decimal and the rest are derived from props that stay put
    // while it runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded, reduceMotion]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <button
      type="button"
      aria-pressed={own}
      onPointerEnter={(e) => e.pointerType !== "touch" && setOwn(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setOwn(false)}
      onPointerDown={(e) => {
        touched.current = e.pointerType === "touch";
      }}
      // A mouse decodes it by hovering; a tap or Enter toggles it. Safari's
      // click doesn't say what made it, so the press remembers.
      onClick={(e) => {
        if (e.detail === 0 || touched.current) setOwn((o) => !o);
      }}
      // Keyboard focus decodes; the focus a tap brings with it doesn't, or
      // the tap's own toggle would undo it straight away.
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOwn(true)}
      onBlur={() => setOwn(false)}
      className={`flex cursor-default touch-manipulation items-baseline gap-[0.45em] rounded-lg px-2 py-1 outline-hidden select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid focus-visible:outline-[#1D9BF0] ${className}`}
    >
      {label ? <span className="text-slate-500 dark:text-slate-400">{label}</span> : null}
      <span className="sr-only">{year}</span>
      <span aria-hidden className="flex font-mono tracking-[0.02em] tabular-nums">
        {[...binary].map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              slots.current[i] = el;
            }}
            data-look="rest"
            // Rest is the binary in a quiet grey; faint is the padding zeros
            // once decoded; strong is the year itself; live is a digit
            // mid-flicker, briefly the brightest thing on the line.
            className="w-[1ch] text-center transition-[color,opacity] duration-150 ease-out data-[look=faint]:text-slate-900 data-[look=faint]:opacity-[0.22] data-[look=live]:text-slate-900 data-[look=rest]:text-slate-400 data-[look=strong]:text-slate-900 dark:data-[look=faint]:text-slate-100 dark:data-[look=live]:text-slate-100 dark:data-[look=rest]:text-slate-500 dark:data-[look=strong]:text-slate-100"
          >
            {char}
          </span>
        ))}
      </span>
    </button>
  );
}
