import { UseinfiniteScrollOptions } from '../helpers/youtubeVideoInterfaces.ts';
import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (callBack: () => Promise<void>, loading: boolean, limit: number, options?: UseinfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting) console.log('intersecting');
        if (target.isIntersecting && limit < 10 && !loading) {
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
  }, [callBack, loading, options, limit]);

  return sentinelRef;
};
