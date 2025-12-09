"use client";

import { useRef, type ReactNode, type TouchEvent } from "react";

interface SwipeWrapperProps {
  children: ReactNode;
  onSwipeRight?: () => void;
  threshold?: number;
}

/**
 * SwipeWrapper Component
 *
 * Detects right swipe gestures and triggers a callback when the swipe
 * threshold is met. Designed for mobile navigation patterns.
 *
 * @param children - Content to wrap with swipe detection
 * @param onSwipeRight - Callback function triggered on successful right swipe
 * @param threshold - Minimum swipe distance in pixels to trigger action (default: 100)
 */
export function SwipeWrapper({
  children,
  onSwipeRight,
  threshold = 100,
}: SwipeWrapperProps) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only trigger if horizontal swipe is more prominent than vertical
    // This prevents interfering with vertical scrolling
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontalSwipe && deltaX > threshold) {
      // Right swipe detected
      onSwipeRight?.();
    }
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
}
