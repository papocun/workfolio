'use client';

import React, {
  createContext,
  useContext,
  useState,
  useId,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';

interface MorphingDialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const MorphingDialogContext = createContext<MorphingDialogContextType | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error('useMorphingDialog must be used within a MorphingDialog');
  }
  return context;
}

interface MorphingDialogProps {
  children: ReactNode;
  transition?: Transition;
}

export function MorphingDialog({
  children,
}: MorphingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <MorphingDialogContext.Provider
      value={{ isOpen, setIsOpen, uniqueId, triggerRef }}
    >
      {children}
    </MorphingDialogContext.Provider>
  );
}

export function MorphingDialogTrigger({
  children,
  className = '',
  style,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const { setIsOpen, uniqueId, triggerRef } = useMorphingDialog();

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      onClick={() => {
        setIsOpen(true);
        onClick?.();
      }}
      className={`cursor-pointer ${className}`}
      style={style}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogContainer({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen } = useMorphingDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs"
          />
          {children}
        </div>
      )}
    </AnimatePresence>
  );
}

export function MorphingDialogContent({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-${uniqueId}`}
      role="dialog"
      aria-modal="true"
      className={`relative z-10 w-full max-w-[560px] bg-white dark:bg-[#16181C] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}
      style={style}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.h2
      layoutId={`dialog-title-${uniqueId}`}
      className={`font-bold text-slate-900 dark:text-slate-100 ${className}`}
    >
      {children}
    </motion.h2>
  );
}

export function MorphingDialogSubtitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div
      layoutId={`dialog-subtitle-${uniqueId}`}
      className={`text-slate-600 dark:text-slate-400 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogClose({
  className = '',
}: {
  className?: string;
}) {
  const { setIsOpen } = useMorphingDialog();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(false)}
      aria-label="Close dialog"
      className={`absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
      </svg>
    </button>
  );
}
