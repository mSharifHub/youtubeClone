import React from 'react';

interface ToolTipProps {
  text: string;
  visible: boolean;
}

export const ToolTip: React.FC<ToolTipProps> = ({ text, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute  top-full -right-5 bg-slate-500 text-white text-xs px-1.5 py-1.5  text-center rounded-md  z-20">
      {text}
    </div>
  );
};
