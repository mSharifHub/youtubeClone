import React, { useState, useCallback, useRef } from 'react';

export const useToolTip = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [toolTipText, setToolTipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const timerRef = useRef<number | null>(null);

  const toolTipMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, text: string | null = null) => {
      const target = event.currentTarget as HTMLDivElement;
      const toolTipText = text ? text : target.title.trim();
      const rect = target.getBoundingClientRect();

      if (!toolTipText || !rect) {
        setShowTooltip(false);
        return;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setTooltipPosition({ top: rect.top + 30, left: rect.left + 15 });
      setToolTipText(toolTipText);

      timerRef.current = window.setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
    },
    [],
  );

  const toolTipMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowTooltip(false);
  }, []);

  return {
    showTooltip,
    toolTipText,
    tooltipPosition,
    toolTipMouseEnter,
    toolTipMouseLeave,
  };
};
