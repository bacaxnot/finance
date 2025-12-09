"use client";

import { type RefObject, useLayoutEffect, useRef, useState } from "react";

interface UseFitTextResult<T extends HTMLElement> {
  ref: RefObject<T>;
  scale: number;
}

/**
 * Observes the text element and its container to keep the content on one line.
 * Returns a ref to attach to the text element plus the current scale.
 */
export function useFitText<T extends HTMLElement>(
  dependency?: string | number,
): UseFitTextResult<T> {
  const ref = useRef<T | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const parent = node.parentElement;
    if (!parent) {
      return;
    }

    const measure = () => {
      const availableWidth = parent.clientWidth;
      const contentWidth = node.scrollWidth;

      if (!availableWidth || !contentWidth) {
        setScale(1);
        return;
      }

      const nextScale = Math.min(1, availableWidth / contentWidth);
      setScale((current) =>
        Math.abs(current - nextScale) < 0.01 ? current : nextScale,
      );
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => {
        window.removeEventListener("resize", measure);
      };
    }

    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [dependency]);

  return { ref, scale };
}
