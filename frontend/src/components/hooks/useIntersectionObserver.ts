import { InfiniteScrollOptions } from '../../types/youtubeVideoInterfaces.ts';
import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (callBack: () => Promise<void>, loading: boolean, dataLength: number, limit?: number, options?: InfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];

        if (limit && dataLength >= limit) return;

        if (target.isIntersecting && !loading) {
          if (sentinelRef.current) {
            observerRef.current?.unobserve(sentinelRef.current);
            await callBack();
          }
        }
      },
      {
        root: options?.root ?? null,
        rootMargin: options?.rootMargin ?? '0px',
        threshold: options?.threshold ?? 0,
      },
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [callBack, options]);

  return sentinelRef;
};
