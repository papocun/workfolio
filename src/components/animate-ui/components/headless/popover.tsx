'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  close: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextType | null>(null);

export function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopover must be used within a <Popover>');
  }
  return context;
}

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Popover({ children, className = '', ...props }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Handle outside click to close
  useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node | null;
      if (!target) return;

      const clickedButton = buttonRef.current?.contains(target);
      const clickedPanel = panelRef.current?.contains(target);

      if (!clickedButton && !clickedPanel) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleMouseDown);
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <PopoverContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggle,
        close,
        buttonRef,
        panelRef,
      }}
    >
      <div className={`relative ${className}`} {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export interface PopoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  asChild?: boolean;
}

export const PopoverButton = React.forwardRef<
  HTMLButtonElement,
  PopoverButtonProps
>(function PopoverButton({ children, onClick, className = '', ...props }, ref) {
  const { isOpen, toggle, buttonRef } = usePopover();

  // Combine forwardRef and context buttonRef
  const handleRef = (node: HTMLButtonElement | null) => {
    buttonRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }
  };

  return (
    <button
      ref={handleRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      onClick={(e) => {
        onClick?.(e);
        toggle();
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});

export interface PopoverAnchor {
  to?: 'left' | 'right' | 'top' | 'bottom' | 'bottom-end' | 'bottom-start';
  gap?: number;
}

export interface PopoverPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  anchor?: PopoverAnchor | string;
  className?: string;
  children?: ReactNode;
}

export function PopoverPanel({
  anchor = { to: 'bottom-end', gap: 8 },
  className = '',
  children,
  ...props
}: PopoverPanelProps) {
  const { isOpen, panelRef } = usePopover();
  const shouldReduceMotion = useReducedMotion();

  const to =
    typeof anchor === 'object'
      ? anchor.to || 'bottom-end'
      : typeof anchor === 'string'
      ? anchor
      : 'bottom-end';
  const gap = typeof anchor === 'object' ? anchor.gap ?? 8 : 8;

  // Anchor style calculation relative to trigger
  let anchorClasses = '';
  let initialOffset = { x: 0, y: 0 };

  if (to === 'left') {
    anchorClasses = 'right-full top-1/2 -translate-y-1/2';
    initialOffset = { x: 8, y: 0 };
  } else if (to === 'right') {
    anchorClasses = 'left-full top-1/2 -translate-y-1/2';
    initialOffset = { x: -8, y: 0 };
  } else if (to === 'bottom-end' || to === 'bottom') {
    anchorClasses = 'top-full right-0';
    initialOffset = { x: 0, y: -6 };
  } else if (to === 'bottom-start') {
    anchorClasses = 'top-full left-0';
    initialOffset = { x: 0, y: -6 };
  } else if (to === 'top') {
    anchorClasses = 'bottom-full right-0';
    initialOffset = { x: 0, y: 6 };
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          tabIndex={-1}
          style={{
            marginRight: to === 'left' ? `${gap}px` : undefined,
            marginLeft: to === 'right' ? `${gap}px` : undefined,
            marginTop: to.startsWith('bottom') ? `${gap}px` : undefined,
            marginBottom: to === 'top' ? `${gap}px` : undefined,
          }}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.95, ...initialOffset }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, x: 0, y: 0 }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.95, ...initialOffset }
          }
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className={`absolute z-50 ${anchorClasses} ${className}`}
          {...(props as any)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
