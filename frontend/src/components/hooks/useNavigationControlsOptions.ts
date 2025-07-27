import React, { useCallback, useRef, useState } from 'react';

interface UseNavigationControlsOptions {
  videosPerRow: number;
  playlistLength: number;
}

export const useNavigationControlsOptions = ({ videosPerRow, playlistLength }: UseNavigationControlsOptions) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [viewAll, setViewAll] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getScrollAmount = useCallback(() => {
    const containerWidth = scrollRef.current?.clientWidth ?? 0;
    return containerWidth / videosPerRow;
  }, [videosPerRow]);

  const scrollToPosition = useCallback(
    (index: number, smooth: boolean = true) => {
      if (!scrollRef.current) return;
      const scrollAmount = getScrollAmount();
      const targetScrollLeft = index * scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: smooth ? 'smooth' : 'instant',
      });
    },

    [getScrollAmount],
  );

  const handleScrollUp = () => {
    if (!scrollRef.current) return;
    const maxIndex = Math.max(0, playlistLength- videosPerRow);
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    setCurrentIndex(newIndex);
    scrollToPosition(newIndex);
  };

  const handleScrollDown = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    scrollToPosition(newIndex);
  };

  const handleViewAll = () => {
    setViewAll((prev) => !prev);
  };

  return {
    currentIndex,
    viewAll,
    scrollRef,
    handleScrollUp,
    handleScrollDown,
    handleViewAll,
  };
};
