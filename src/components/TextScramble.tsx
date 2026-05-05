'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TextScrambleProps {
  /** The final text to decode into */
  text: string;
  /** Optional custom CSS classes */
  className?: string;
  /** Initial delay in milliseconds before starting scramble */
  delay?: number;
  /** Duration in ms for each character to scramble before locking */
  charDuration?: number;
  /** Stagger time in ms between consecutive characters settling */
  charStagger?: number;
  /** Glyphs set to pick random churning characters from */
  glyphs?: string;
  /** Whether hovering over the element re-triggers the decode effect */
  triggerOnHover?: boolean;
  /** Custom HTML tag to render (default 'span') */
  as?: React.ElementType;
}

const DEFAULT_GLYPHS =
  '!<>-_\\/[]{}—=+*^?#~0123456789abcdefghijklmnopqrstuvwxyz';

export default function TextScramble({
  text,
  className = '',
  delay = 150,
  charDuration = 480,
  charStagger = 80,
  glyphs = DEFAULT_GLYPHS,
  triggerOnHover = true,
  as: Component = 'span',
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const isMountedRef = useRef(false);

  const startScramble = useCallback(() => {
    // Honor prefers-reduced-motion: render instantly with zero animation
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayText(text);
      setIsAnimating(false);
      return;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsAnimating(true);
    const length = text.length;
    const startTime = performance.now() + delay;
    const totalDuration = delay + length * charStagger + charDuration;

    // Precalculate settle timestamp for each character index
    const settleTimes = text.split('').map((char, index) => {
      if (char === ' ') return 0; // Spaces lock immediately
      return startTime + index * charStagger + charDuration;
    });

    let lastChurnTime = 0;
    const churnInterval = 45; // Smooth glyph churning interval

    const updateFrame = (currentTime: number) => {
      const isPastDelay = currentTime >= startTime;
      const shouldChurn = currentTime - lastChurnTime >= churnInterval;

      if (shouldChurn || currentTime >= startTime + totalDuration) {
        lastChurnTime = currentTime;

        let allSettled = true;
        const resultChars: string[] = [];

        for (let i = 0; i < length; i++) {
          const targetChar = text[i];

          if (targetChar === ' ') {
            resultChars.push(' ');
            continue;
          }

          if (!isPastDelay) {
            // Before initial delay, churn random glyphs
            allSettled = false;
            resultChars.push(
              glyphs[Math.floor(Math.random() * glyphs.length)]
            );
          } else if (currentTime >= settleTimes[i]) {
            // Character has settled to final glyph
            resultChars.push(targetChar);
          } else {
            // Character is still actively churning
            allSettled = false;
            resultChars.push(
              glyphs[Math.floor(Math.random() * glyphs.length)]
            );
          }
        }

        setDisplayText(resultChars.join(''));

        if (allSettled && currentTime >= startTime + length * charStagger) {
          setDisplayText(text);
          setIsAnimating(false);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateFrame);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrame);
  }, [text, delay, charDuration, charStagger, glyphs]);

  useEffect(() => {
    isMountedRef.current = true;
    startScramble();

    return () => {
      isMountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startScramble]);

  const handleMouseEnter = () => {
    if (triggerOnHover && !isAnimating) {
      startScramble();
    }
  };

  return (
    <Component
      className={`inline-block max-w-full break-words tabular-nums font-sans ${className}`}
      aria-label={text}
      role="text"
      onMouseEnter={handleMouseEnter}
      style={{
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <span aria-hidden="true" className="select-none inline-block max-w-full break-words">
        {displayText}
      </span>
    </Component>
  );
}
