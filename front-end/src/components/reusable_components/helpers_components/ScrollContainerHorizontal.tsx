import React from 'react';

interface ScrollContainerHorizontalProps {
  children: React.ReactNode;
}

export default function ScrollContainerHorizontal({
  children,
}: ScrollContainerHorizontalProps) {
  return (
    <div className=" h-12 flex justify-start  items-center px-2 space-x-4 overflow-x-auto scroll-smooth  whitespace-nowrap no-scrollbar   ">
      {children}
    </div>
  );
}
