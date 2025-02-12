import React from 'react';
import Portal from './Portal.ts';

interface ToolTipProps {
  text: string;
  visible: boolean;
  position: { top: number; left: number };
}

export const ToolTip: React.FC<ToolTipProps> = ({
  text,
  visible,
  position,
}) => {
  if (!visible) return null;

  const { top, left } = position;

  return (
    <Portal>
      <div
        className="absolute  bg-neutral-800  border-[0.5px] dark:dark-modal text-white text-xs px-[2px] py-[2px]  text-center  z-20"
        style={{ top: top, left: left }}
      >
        {text}
      </div>
    </Portal>
  );
};
