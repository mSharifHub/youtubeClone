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

    if (screenWidth <= 699) {
      setVideosPerRow(1); // 1 video per row on very small screens (2 rows total)
    } else if (screenWidth >= 700 && screenWidth <= 1124) {
      setVideosPerRow(2); // 2 videos per row (2 rows total)
    } else if (screenWidth >= 1125 && screenWidth <= 1420) {
      setVideosPerRow(3); // 3 videos per row (2 rows total)
    } else if (screenWidth >= 1421 && screenWidth <= 1739) {
      setVideosPerRow(4); // 4 videos per row (2 rows total)
    } else {
      setVideosPerRow(5); // 5 videos per row (2 rows total)
    }
  };

  // Adding the throttle function here with 150 seconds time out
  const throttleVideosToShowPerRow = useThrottle(determineVideosToShow, 100);

  // use effect to change the state whenever
  useEffect(() => {
    throttleVideosToShowPerRow();

    const handleVideosToShow = () => {
      throttleVideosToShowPerRow();
    };

    window.addEventListener('resize', handleVideosToShow);

    return () => window.removeEventListener('resize', handleVideosToShow);
  }, [throttleVideosToShowPerRow]);

  return videosPerRow;
};
