import { RefObject, useEffect } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement | undefined>,
  callback: () => void,
  isOpen: boolean,
) => {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      callback();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClick);

      return () => removeEventListener('click', handleClick);
    }
  }, [isOpen]);
};
