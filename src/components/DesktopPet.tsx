'use client';

/**
 * DesktopPet.tsx
 * Adapted from just-NPCthings/pet (https://github.com/just-NPCthings/pet)
 * Interactive pixel-art desktop pet cat for Next.js portfolio.
 * 
 * Credits & License:
 * Original pixel-art cat sprite assets and animation behaviors from just-NPCthings/pet.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getAssetPath } from '@/lib/assetPath';

export interface DesktopPetProps {
  /** Size in pixels (width). Height is automatically scaled to maintain the 165x138 sprite aspect ratio. Default: 76 */
  size?: number;
  /** Movement speed in pixels per frame tick. Default: 3.2 */
  movementSpeed?: number;
  /** Safe stopping distance from the mouse pointer to prevent sitting right under cursor. Default: 75 */
  distanceFromPointer?: number;
  /** Delay in milliseconds before transitioning from watching to idle when pointer stops. Default: 2200 */
  idleDelayMs?: number;
  /** Enable random idle behaviors such as sleeping or watching when inactive. Default: true */
  enableRandomIdleBehaviors?: boolean;
  /** Initial starting position. Default: bottom-right area */
  initialPosition?: { x?: number; y?: number } | 'bottom-right';
  /** Additional CSS class names for the pet container */
  className?: string;
}

type AnimationState = 'idle' | 'walk_left' | 'walk_right' | 'sleep' | 'watching';

const SPRITE_ORIGINAL_W = 165;
const SPRITE_ORIGINAL_H = 138;

const ANIMATION_FRAME_COUNTS: Record<AnimationState, number> = {
  idle: 8,
  walk_left: 8,
  walk_right: 8,
  sleep: 2,
  watching: 8,
};

const FRAME_INTERVALS_MS: Record<AnimationState, number> = {
  idle: 160,
  walk_left: 110,
  walk_right: 110,
  sleep: 500,
  watching: 200,
};

export default function DesktopPet({
  size = 76,
  movementSpeed = 3.2,
  distanceFromPointer = 75,
  idleDelayMs = 2200,
  enableRandomIdleBehaviors = true,
  initialPosition = 'bottom-right',
  className = '',
}: DesktopPetProps) {
  const spriteW = size;
  const spriteH = Math.round((size * SPRITE_ORIGINAL_H) / SPRITE_ORIGINAL_W);

  // Position and movement state
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -999, y: -999 });
  const [currentState, setCurrentState] = useState<AnimationState>('idle');
  const [frameIndex, setFrameIndex] = useState<number>(1);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Refs for animation & movement loop
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const lastMouseMoveTimeRef = useRef<number>(Date.now());
  const currentStateRef = useRef<AnimationState>('idle');
  const frameIndexRef = useRef<number>(1);
  const isTouchDeviceRef = useRef<boolean>(false);

  // Preload all sprite frames on mount
  useEffect(() => {
    setIsClient(true);

    // Detect touch-only mobile devices
    isTouchDeviceRef.current =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

    // Initial position placement
    const initX =
      typeof initialPosition === 'object' && initialPosition.x !== undefined
        ? initialPosition.x
        : window.innerWidth - spriteW - 28;
    const initY =
      typeof initialPosition === 'object' && initialPosition.y !== undefined
        ? initialPosition.y
        : window.innerHeight - spriteH - 32;

    const clampedX = Math.max(10, Math.min(window.innerWidth - spriteW - 10, initX));
    const clampedY = Math.max(10, Math.min(window.innerHeight - spriteH - 10, initY));

    posRef.current = { x: clampedX, y: clampedY };
    setPos({ x: clampedX, y: clampedY });

    // Preload image assets
    const states: AnimationState[] = ['idle', 'walk_left', 'walk_right', 'sleep', 'watching'];
    states.forEach((st) => {
      const count = ANIMATION_FRAME_COUNTS[st];
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = getAssetPath(`/pet/cat_${st}${i}.png`);
      }
    });
  }, [initialPosition, spriteW, spriteH]);

  // Track pointer movements
  useEffect(() => {
    if (!isClient) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Ignore simulated touches on mobile for pointer-following
      if (e.pointerType === 'touch' || isTouchDeviceRef.current) return;

      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      lastMouseMoveTimeRef.current = Date.now();

      // Wake up from sleep immediately when mouse moves
      if (currentStateRef.current === 'sleep') {
        currentStateRef.current = 'idle';
        setCurrentState('idle');
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [isClient]);

  // Main movement loop (runs on 60fps requestAnimationFrame)
  useEffect(() => {
    if (!isClient) return;

    let animFrameId: number;

    const updateMovement = () => {
      if (isTouchDeviceRef.current) {
        // Mobile stays anchored without following pointer
        animFrameId = requestAnimationFrame(updateMovement);
        return;
      }

      const now = Date.now();
      const currentX = posRef.current.x;
      const currentY = posRef.current.y;
      const catCenterX = currentX + spriteW / 2;
      const catCenterY = currentY + spriteH / 2;

      if (mouseRef.current.active) {
        const targetX = mouseRef.current.x;
        const targetY = mouseRef.current.y;
        const dx = targetX - catCenterX;
        const dy = targetY - catCenterY;
        const dist = Math.hypot(dx, dy);

        // If distance exceeds the target threshold, walk toward pointer
        if (dist > distanceFromPointer + 12) {
          const vx = (dx / dist) * movementSpeed;
          const vy = (dy / dist) * movementSpeed;

          const nextX = currentX + vx;
          const nextY = currentY + vy;

          // Clamp within viewport
          const clampedX = Math.max(8, Math.min(window.innerWidth - spriteW - 8, nextX));
          const clampedY = Math.max(8, Math.min(window.innerHeight - spriteH - 8, nextY));

          posRef.current = { x: clampedX, y: clampedY };
          setPos({ x: clampedX, y: clampedY });

          // Determine walking direction
          const nextState: AnimationState = dx < 0 ? 'walk_left' : 'walk_right';
          if (currentStateRef.current !== nextState) {
            currentStateRef.current = nextState;
            setCurrentState(nextState);
            frameIndexRef.current = 1;
            setFrameIndex(1);
          }
        } else {
          // Reached target stopping zone
          const timeSinceMouseMove = now - lastMouseMoveTimeRef.current;

          if (timeSinceMouseMove < idleDelayMs) {
            // Pointer moved recently: watch cursor with 8-direction head tilt
            if (currentStateRef.current !== 'watching') {
              currentStateRef.current = 'watching';
              setCurrentState('watching');
            }

            // Map angle [-PI, PI] to 8 directions:
            // 0=right, 1=down-right, 2=down, 3=down-left, 4=left, 5=up-left, 6=up, 7=up-right
            const angle = Math.atan2(dy, dx);
            let octant = Math.round((8 * angle) / (2 * Math.PI) + 8) % 8;
            const watchFrame = octant + 1;

            if (frameIndexRef.current !== watchFrame) {
              frameIndexRef.current = watchFrame;
              setFrameIndex(watchFrame);
            }
          } else {
            // Mouse stopped for a while: return to idle
            if (currentStateRef.current !== 'idle' && currentStateRef.current !== 'sleep') {
              currentStateRef.current = 'idle';
              setCurrentState('idle');
              frameIndexRef.current = 1;
              setFrameIndex(1);
            }
          }
        }
      } else {
        // Pointer is outside window / inactive
        if (currentStateRef.current !== 'idle' && currentStateRef.current !== 'sleep') {
          currentStateRef.current = 'idle';
          setCurrentState('idle');
          frameIndexRef.current = 1;
          setFrameIndex(1);
        }
      }

      animFrameId = requestAnimationFrame(updateMovement);
    };

    animFrameId = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(animFrameId);
  }, [isClient, spriteW, spriteH, movementSpeed, distanceFromPointer, idleDelayMs]);

  // Frame animation stepping loop
  useEffect(() => {
    if (!isClient) return;

    let frameTimer: NodeJS.Timeout;

    const stepFrame = () => {
      const state = currentStateRef.current;

      // In 'watching' state, frame is driven by mouse angle instead of looping
      if (state !== 'watching') {
        const totalFrames = ANIMATION_FRAME_COUNTS[state];
        const nextFrame = (frameIndexRef.current % totalFrames) + 1;
        frameIndexRef.current = nextFrame;
        setFrameIndex(nextFrame);
      }

      const delay = FRAME_INTERVALS_MS[state] || 150;
      frameTimer = setTimeout(stepFrame, delay);
    };

    frameTimer = setTimeout(stepFrame, FRAME_INTERVALS_MS[currentState] || 150);
    return () => clearTimeout(frameTimer);
  }, [isClient, currentState]);

  // Random idle behaviors (e.g. periodic sleep / stretching after extended idle)
  useEffect(() => {
    if (!isClient || !enableRandomIdleBehaviors) return;

    const checkIdleBehavior = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastMouseMoveTimeRef.current;

      // If idle for >12s, 40% chance to fall asleep
      if (idleTime > 12000 && currentStateRef.current === 'idle') {
        const shouldSleep = Math.random() < 0.45;
        if (shouldSleep) {
          currentStateRef.current = 'sleep';
          setCurrentState('sleep');
          frameIndexRef.current = 1;
          setFrameIndex(1);

          // Wake up after 8-12 seconds
          setTimeout(() => {
            if (currentStateRef.current === 'sleep') {
              currentStateRef.current = 'idle';
              setCurrentState('idle');
            }
          }, 9000 + Math.random() * 4000);
        }
      }
    }, 5000);

    return () => clearInterval(checkIdleBehavior);
  }, [isClient, enableRandomIdleBehaviors]);

  // Handle window resizing to keep cat on screen
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      const clampedX = Math.max(10, Math.min(window.innerWidth - spriteW - 10, posRef.current.x));
      const clampedY = Math.max(10, Math.min(window.innerHeight - spriteH - 10, posRef.current.y));
      posRef.current = { x: clampedX, y: clampedY };
      setPos({ x: clampedX, y: clampedY });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient, spriteW, spriteH]);

  // Current frame source
  const currentImageSrc = useMemo(() => {
    return getAssetPath(`/pet/cat_${currentState}${frameIndex}.png`);
  }, [currentState, frameIndex]);

  if (!isClient || pos.x < 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 z-50 pointer-events-none select-none transition-opacity duration-300 ${className}`}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        width: `${spriteW}px`,
        height: `${spriteH}px`,
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentImageSrc}
        alt="Desktop Pet Cat"
        width={spriteW}
        height={spriteH}
        className="w-full h-full object-contain pointer-events-none"
        style={{
          imageRendering: 'pixelated',
          filter:
            'drop-shadow(0 0 1.2px rgba(255, 255, 255, 0.35)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.4))',
        }}
        draggable={false}
      />
    </div>
  );
}
