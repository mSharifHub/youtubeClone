import { RefObject, useEffect, useRef } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement | undefined>,
  callback: () => void,
  isOpen: boolean,
) => {
  const callBackRef = useRef<() => void>();

  callBackRef.current = callback;

  const handleClick = (event: MouseEvent) => {
    if (
      ref.current &&
      !ref.current.contains(event.target as HTMLElement) &&
      callBackRef.current
    ) {
      callBackRef.current();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClick);

      return () => removeEventListener('click', handleClick);
    }
  }, [isOpen]);
};
