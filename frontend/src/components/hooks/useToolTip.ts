import React, { useState, useCallback, useRef } from 'react';

export const useToolTip = () => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const [toolTipText, setToolTipText] = useState<string>('');

  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const timerRef = useRef<number | null>(null);

  const toolTipMouseEnterCustomComponent = useCallback((event: React.MouseEvent<HTMLDivElement>, text: string | null = null) => {
    const target = event.currentTarget as HTMLDivElement;

    const toolTipText: string | null = text ? text : target.getAttribute('title');

    const rect = target.getBoundingClientRect();

    if (!toolTipText || !rect) {
      setShowTooltip(false);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setTooltipPosition({ top: rect.top + 40, left: rect.left + 50 });
    setToolTipText(toolTipText);

    timerRef.current = window.setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  }, []);

  const toolTipMouseLeaveCustomComponent = useCallback(() => {
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
    mouseEnter: toolTipMouseEnterCustomComponent,
    mouseLeave: toolTipMouseLeaveCustomComponent,
  };
};
