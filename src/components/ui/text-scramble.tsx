"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>";
// Head start before the first character settles, so the noise registers.
const LEAD = 180;
// Each character settles this long after the one before it.
const STAGGER = 45;
// New noise roughly 25 times a second. Changing it every frame reads as
// flicker rather than decoding.
const TICK = 40;

// One character cell wide, cap height on the baseline, so it sits exactly
// where the letter it covers will land. Letter spacing skips inline blocks,
// so the margin applies tracking-tight by hand to keep the width exact.
const CURSOR =
  "inline-block h-[0.72em] w-[1ch] mr-[-0.025em] bg-current align-baseline";
// Noise is quieter than the settled text, so the eye reads the decoded part
// as the word and the rest as signal still coming in.
const AHEAD = "opacity-35";

function noise(original: string) {
  const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return original === original.toUpperCase() ? glyph.toUpperCase() : glyph;
}

// Writes straight to the node every frame, so decoding never re-renders React.
export function useScramble<T extends HTMLElement>(text: string) {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const scramble = useCallback(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;
    cancelAnimationFrame(frame.current);

    const chars = [...text];
    const current = chars.map(noise);
    const start = performance.now();
    let lastTick = start;
    let lastHead = -1;

    // A block cursor reads the word in: decoded text behind it, a faint
    // churn of noise ahead. Three nodes built once and rewritten in place,
    // so a frame is at most two text writes.
    const done = document.createTextNode("");
    const cursor = document.createElement("span");
    cursor.className = CURSOR;
    const ahead = document.createElement("span");
    ahead.className = AHEAD;
    node.replaceChildren(done, cursor, ahead);

    const step = (now: number) => {
      const elapsed = now - start;
      const refresh = now - lastTick >= TICK;
      if (refresh) lastTick = now;

      // Characters settle strictly left to right, so everything before the
      // first unsettled one is final.
      let head = chars.length;
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] !== " " && elapsed < LEAD + i * STAGGER) {
          head = i;
          break;
        }
      }
      if (head === chars.length) {
        node.textContent = text;
        return;
      }
      if (refresh) current.forEach((_, i) => (current[i] = noise(chars[i])));
      if (refresh || head !== lastHead) {
        lastHead = head;
        done.data = chars.slice(0, head).join("");
        // The cursor covers the character it is decoding, so the word keeps
        // its exact width the whole way through.
        ahead.textContent = chars
          .map((char, i) => (char === " " ? " " : current[i]))
          .slice(head + 1)
          .join("");
      }
      frame.current = requestAnimationFrame(step);
    };
    // Fill the first frame before hit testing, so the button never shrinks
    // under a stationary pointer and retriggers pointerenter.
    step(start);
  }, [text, reduceMotion]);

  return { ref, scramble };
}

/**
 * Inline label that decodes on hover/focus. Locks its width while it scrambles
 * so proportional fonts do not shift neighbouring layout.
 */
export function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const { ref, scramble } = useScramble<HTMLSpanElement>(text);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const run = useCallback(() => {
    const node = ref.current;
    if (node) {
      const width = node.getBoundingClientRect().width;
      node.style.display = "inline-block";
      node.style.width = `${width}px`;
      node.style.whiteSpace = "nowrap";
      node.style.overflow = "hidden";
      node.style.verticalAlign = "bottom";
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        node.removeAttribute("style");
      }, LEAD + text.length * STAGGER + 120);
    }
    scramble();
  }, [ref, scramble, text]);

  // Trigger from the surrounding link/button so the whole target responds.
  useEffect(() => {
    const host = ref.current?.closest("a,button") ?? ref.current?.parentElement;
    if (!host) return;
    host.addEventListener("pointerenter", run);
    host.addEventListener("focus", run);
    return () => {
      host.removeEventListener("pointerenter", run);
      host.removeEventListener("focus", run);
    };
  }, [ref, run]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden className="pointer-events-none">
        {text}
      </span>
    </span>
  );
}
