'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

interface SoundContextType {
  isSoundOn: boolean;
  toggleSound: () => void;
  playClickSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('workfolio-sound');
      if (saved === 'true') {
        setIsSoundOn(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Crisp mechanical tactile click sound synthesizer (~60% pleasant audio level)
  const playClickSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. High transient mechanical click tick (clean 60% listening volume)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2400, now);
      osc1.frequency.exponentialRampToValueAtTime(600, now + 0.022);

      // Volume set to ~0.06 (balanced ~60% UI sound level)
      gain1.gain.setValueAtTime(0.065, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.025);

      // 2. Soft subtle body pop for tactile mechanical feel
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(650, now);
      osc2.frequency.exponentialRampToValueAtTime(140, now + 0.018);

      gain2.gain.setValueAtTime(0.045, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.02);
    } catch {
      // Audio autoplay policy catch
    }
  }, [getAudioContext]);

  const toggleSound = useCallback(() => {
    setIsSoundOn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('workfolio-sound', String(next));
      } catch {
        // ignore
      }
      if (next) {
        // Play instant confirmation feedback click
        setTimeout(playClickSound, 0);
      }
      return next;
    });
  }, [playClickSound]);

  // Global listener: plays click sound whenever an interactive element is clicked while sound is ON
  useEffect(() => {
    if (!isSoundOn || typeof window === 'undefined') return;

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.closest(
          'a, button, [role="button"], [role="switch"], [role="tab"], input, select, textarea, [tabindex="0"], label, summary'
        )
      );

      if (isInteractive) {
        playClickSound();
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [isSoundOn, playClickSound]);

  return (
    <SoundContext.Provider
      value={{
        isSoundOn,
        toggleSound,
        playClickSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
