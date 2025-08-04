import React, { useEffect, useRef, useState } from 'react';
import { useToolTip } from './useToolTip.ts';

export const useHandleMenuComponents = () => {
  const [menuItemHovered, setMenuItemHovered] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const aboutArr = ['git repository', 'linkedin'];

  const { showTooltip, toolTipText, tooltipPosition, mouseEnter, mouseLeave } = useToolTip();

  const handleMenuItemMouseEnter = (event: React.MouseEvent<HTMLDivElement>, text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMenuItemHovered(true);
    mouseEnter(event, text);
  };

  const handleMenuItemMouseLeave = () => {
    mouseLeave();
    timeoutRef.current = setTimeout(() => {
      setMenuItemHovered(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    handleMenuItemMouseEnter,
    handleMenuItemMouseLeave,
    aboutArr,
    showTooltip,
    toolTipText,
    tooltipPosition,
    menuItemHovered,
  };
};
