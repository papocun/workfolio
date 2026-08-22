'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WarningCircle, Info } from '@phosphor-icons/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertBannerProps {
  title: string;
  description?: string;
  variant?: 'default' | 'warning' | 'info';
  dismissible?: boolean;
  autoClose?: boolean;
  autoCloseDuration?: number; // Duration in milliseconds (5000ms = 5 seconds)
}

export default function AlertBanner({
  title,
  description,
  variant = 'warning',
  dismissible = true,
  autoClose = true,
  autoCloseDuration = 5000,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!autoClose || !isVisible) return;

    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, autoCloseDuration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoClose, autoCloseDuration, isVisible]);

  const Icon = variant === 'info' ? Info : WarningCircle;
  const iconColor =
    variant === 'info'
      ? 'text-sky-500 dark:text-sky-400'
      : 'text-amber-500 dark:text-amber-400';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
          exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
          className="w-full mb-6 overflow-hidden"
        >
          <Alert
            variant={variant}
            onClose={dismissible ? handleClose : undefined}
          >
            <Icon
              size={18}
              weight="fill"
              className={`shrink-0 mt-0.5 ${iconColor}`}
            />
            <div className="flex-1">
              <AlertTitle>{title}</AlertTitle>
              {description && <AlertDescription>{description}</AlertDescription>}
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
