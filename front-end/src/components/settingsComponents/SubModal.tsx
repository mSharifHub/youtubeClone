import { JSX } from 'react/jsx-runtime';
import React, { useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside.ts';

interface SubModalProps {
  isOpen: boolean;
  onClickOutside: () => void;
  children: React.ReactNode;
}

export const SubModal: React.FC<SubModalProps> = ({
  isOpen,
  onClickOutside,
  children,
}): JSX.Element => {
  const modalRef = useRef<HTMLDivElement>(null);

  const onCLickInside = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  useClickOutside(modalRef, onClickOutside, isOpen);

  return (
    <div
      ref={modalRef}
      className="absolute  transition-transform ease-in-out duration-100  top-16 right-4 bg-white dark:dark-modal drop-shadow-lg min-h-fit  min-w-fit w-64 rounded-lg z-20"
      onClick={onCLickInside}
    >
      {children}
    </div>
  );
};
