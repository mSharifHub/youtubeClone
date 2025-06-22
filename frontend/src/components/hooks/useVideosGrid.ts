import { useEffect, useState } from 'react';
import { useThrottle } from './useThrottle.ts';

interface VideoGridProps {
  display_less_480?: number;
  display_481_699?: number;
  display_700_899?: number;
  display_900_1124?: number;
  display_1125_1420?: number;
  display_1421_1739?: number;
  display_1740_1920?: number;
  display_full?: number;
}

function getVideosPerRowFromWidth(props: VideoGridProps, width: number): number {
  const { display_less_480, display_481_699, display_700_899, display_900_1124, display_1125_1420, display_1421_1739, display_1740_1920, display_full } = props;

  if (width <= 480) return display_less_480 ?? 1;
  if (width >= 481 && width <= 699) return display_481_699 ?? 1;
  if (width >= 700 && width <= 899) return display_700_899 ?? 2;
  if (width >= 900 && width <= 1124) return display_900_1124 ?? 3;
  if (width >= 1125 && width <= 1420) return display_1125_1420 ?? 3;
  if (width >= 1421 && width <= 1739) return display_1421_1739 ?? 4;
  if (width >= 1740 && width <= 1920) return display_1740_1920 ?? 5;
  return display_full ?? 5;
}

export const useVideoGrid = (props: VideoGridProps): number => {
  const [videosPerRow, setVideosPerRow] = useState<number>(() => (typeof window !== 'undefined' ? getVideosPerRowFromWidth(props, window.innerWidth) : props.display_full ?? 1));

  const determineVideosToShow = () => {
    setVideosPerRow(getVideosPerRowFromWidth(props, window.innerWidth));
  };

  const throttleVideosToShowPerRow = useThrottle(determineVideosToShow, 100);

  useEffect(() => {
    const handleVideosToShow = () => {
      throttleVideosToShowPerRow();
    };

    window.addEventListener('resize', handleVideosToShow);
    return () => window.removeEventListener('resize', handleVideosToShow);
  }, [throttleVideosToShowPerRow]);

  return videosPerRow;
};
