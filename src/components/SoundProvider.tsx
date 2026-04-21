'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

interface SoundContextType {
  isSoundOn: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  playClickSound: (customVolume?: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedSound = localStorage.getItem('workfolio-sound');
      if (savedSound === 'true') {
        setIsSoundOn(true);
      }
      const savedVolume = localStorage.getItem('workfolio-volume');
      if (savedVolume !== null) {
        const parsed = parseInt(savedVolume, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
          setVolumeState(parsed);
        }
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

  // Crisp mechanical tactile click sound synthesizer scaled by volume
  const playClickSound = useCallback(
    (customVolume?: number) => {
      const effectiveVol = customVolume !== undefined ? customVolume : volume;
      if (effectiveVol <= 0) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        const volFraction = Math.max(0, Math.min(1, effectiveVol / 100));

        // 1. High transient mechanical click tick
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2400, now);
        osc1.frequency.exponentialRampToValueAtTime(600, now + 0.022);

        gain1.gain.setValueAtTime(0.065 * volFraction, now);
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

        gain2.gain.setValueAtTime(0.045 * volFraction, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.02);
      } catch {
        // Audio autoplay policy catch
      }
    },
    [getAudioContext, volume]
  );

  const setVolume = useCallback(
    (vol: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(vol)));
      setVolumeState(clamped);
      try {
        localStorage.setItem('workfolio-volume', String(clamped));
      } catch {
        // ignore
      }
    },
    []
  );

  const setSoundEnabled = useCallback(
    (enabled: boolean) => {
      setIsSoundOn(enabled);
      try {
        localStorage.setItem('workfolio-sound', String(enabled));
      } catch {
        // ignore
      }
      if (enabled) {
        setTimeout(() => playClickSound(volume), 0);
      }
    },
    [playClickSound, volume]
  );

  const toggleSound = useCallback(() => {
    setIsSoundOn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('workfolio-sound', String(next));
      } catch {
        // ignore
      }
      if (next) {
        setTimeout(() => playClickSound(volume), 0);
      }
      return next;
    });
  }, [playClickSound, volume]);

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
        setSoundEnabled,
        playClickSound,
        volume,
        setVolume,
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
