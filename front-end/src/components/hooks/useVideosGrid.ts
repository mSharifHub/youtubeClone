import { useEffect, useState } from 'react';
import { useThrottle } from './useThrottle.ts';

/**
 * @videosPerRow{number} return number of videos show per row.
 * @setVideosPerRow{void} function that uses screen width to set number of videos to show
 * @return is the number of videos per row to be used
 */
export const useVideoGrid = () => {
  const [videosPerRow, setVideosPerRow] = useState<number>(5);

  const determineVideosToShow = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 500) {
      setVideosPerRow(1); // 1 video per row on very small screens (2 rows total)
    } else if (screenWidth > 500 && screenWidth <= 739) {
      setVideosPerRow(2); // 2 videos per row (2 rows total)
    } else if (screenWidth >= 740 && screenWidth <= 1023) {
      setVideosPerRow(3); // 3 videos per row (2 rows total)
    } else if (screenWidth >= 1024 && screenWidth <= 1279) {
      setVideosPerRow(4); // 4 videos per row (2 rows total)
    } else {
      setVideosPerRow(5); // 5 videos per row (2 rows total)
    }
  };

  // adding the throttle function here with 150 seconds time out
  const throttleDetermineVideosToSHow = useThrottle(determineVideosToShow, 150);

  // use effect to change the state whenever
  useEffect(() => {
    throttleDetermineVideosToSHow();

    const handleVideosToShow = () => {
      throttleDetermineVideosToSHow();
    };

    window.addEventListener('resize', handleVideosToShow);

    return () => window.removeEventListener('resize', handleVideosToShow);
  }, [throttleDetermineVideosToSHow]);

  return videosPerRow;
};
