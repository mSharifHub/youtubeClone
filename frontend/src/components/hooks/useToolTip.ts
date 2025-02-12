import React, { useState, useCallback, useRef } from 'react';

export const useToolTip = () => {
  // state to hide or show tool tip
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  // state to set title
  const [toolTipText, setToolTipText] = useState<string>('');

  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  // keep track of how long element should show after leaving div element
  const timerRef = useRef<number | null>(null);

  // when entering  an element
  const toolTipMouseEnterCustomComponent = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, text: string | null = null) => {
      const target = event.currentTarget as HTMLDivElement;
      //gets the title of element
      const toolTipText: string | null = text
        ? text
        : target.getAttribute('title');

      // const to get position of the element
      const rect = target.getBoundingClientRect();

      // if there is no text or not a position then show state should be false
      if (!toolTipText || !rect) {
        setShowTooltip(false);
        return;
      }
      // clear time
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setTooltipPosition({ top: rect.top + 40, left: rect.left + 50 });
      setToolTipText(toolTipText);

      // set timer to one second to show tool tip
      timerRef.current = window.setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
    },
    [],
  );

  // when leaving an element
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
