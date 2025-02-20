import { useRef } from 'react';

export const useDebounce = <T extends (...args: number[]) => ReturnType<T> | undefined>(callBack: T, delay: number) => {
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  // to allow the first render after call to be executed and delay n + 1 call to be executed after
  const isFirst = useRef<boolean>(true);

  return (...args: Parameters<T>) => {
    if (isFirst.current) {
      callBack(...args);
      isFirst.current = false;
    } else {
      if (intervalId.current) {
        clearTimeout(intervalId.current);
      }

      intervalId.current = setTimeout(() => {
        callBack(...args);
        isFirst.current = true;
      }, delay);
    }
  };
};
