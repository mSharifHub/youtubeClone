import { UseinfiniteScrollOptions } from '../helpers/youtubeVideoInterfaces.ts';
import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (callBack: () => Promise<void>, loading: boolean, limit: number, options?: UseinfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && limit < 50 && !loading) {
          if (sentinelRef.current) {
            observerRef.current?.unobserve(sentinelRef.current);
            setCount((prev) => prev + 1);
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
  useEffect(() => {
    if (count === 0) return;
    console.log(count);
  }, [count]);

  return sentinelRef;
};
