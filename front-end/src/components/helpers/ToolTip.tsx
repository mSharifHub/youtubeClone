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
        className="absolute  bg-slate-900 text-white text-xs px-[2px] py-[2px]  opacity-50 text-center  z-20"
        style={{ top: top, left: left }}
      >
        {text}
      </div>
    </Portal>
  );
};
