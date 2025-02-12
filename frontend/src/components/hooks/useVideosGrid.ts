import { useEffect, useState } from 'react';
import { useThrottle } from './useThrottle.ts';

/**
 * @videosPerRow{number} return number of videos show per row.
 * @setVideosPerRow{void} function that uses screen width to set number of videos to show
 * @return is the number of videos per row to be used
 */

interface VideoGridProps {
  display_less_480?: number | undefined;
  display_481_699?: number | undefined;
  display_700_899?: number | undefined;
  display_900_1124?: number | undefined;
  display_1125_1420?: number | undefined;
  display_1421_1739?: number | undefined;
  display_1740_1920?: number | undefined;
  display_full?: number | undefined;
}

export const useVideoGrid = ({
  display_less_480,
  display_481_699,
  display_700_899,
  display_900_1124,
  display_1125_1420,
  display_1421_1739,
  display_1740_1920,
  display_full,
}: VideoGridProps): number | undefined => {
  const [videosPerRow, setVideosPerRow] = useState<number | undefined>(
    display_full,
  );

  const determineVideosToShow = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      setVideosPerRow(display_less_480); // Very small screens
    } else if (screenWidth >= 481 && screenWidth <= 699) {
      setVideosPerRow(display_481_699); // Small screens
    } else if (screenWidth >= 700 && screenWidth <= 899) {
      setVideosPerRow(display_700_899); // Small-to-medium screens
    } else if (screenWidth >= 900 && screenWidth <= 1124) {
      setVideosPerRow(display_900_1124); // Medium screens
    } else if (screenWidth >= 1125 && screenWidth <= 1420) {
      setVideosPerRow(display_1125_1420); // Medium-to-large screens
    } else if (screenWidth >= 1421 && screenWidth <= 1739) {
      setVideosPerRow(display_1421_1739); // Large screens
    } else if (screenWidth >= 1740 && screenWidth <= 1920) {
      setVideosPerRow(display_1740_1920); // Very large screens
    } else {
      setVideosPerRow(display_full); // Ultra-wide or full-screen displays
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
