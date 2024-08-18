import { useRef } from 'react';

export const useThrottle = <
  T extends (...args: number[]) => ReturnType<T> | undefined,
>(
  callBack: T,
  interval: number,
) => {
  const lastExecuted = useRef<number>(0);

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastExecuted.current < interval) return;

    lastExecuted.current = now;

    return callBack(...args);
  };
};
