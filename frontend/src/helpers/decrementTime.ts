import React from 'react';

export default function decrementTime(
  setRemainingTime: React.Dispatch<
    React.SetStateAction<{
      hours: number;
      minutes: number;
      seconds: number;
    } | null>
  >,

  timerRef: React.MutableRefObject<number | null>,
) {
  setRemainingTime((prevTime) => {
    if (!prevTime) {
      clearInterval(timerRef.current as number);
      return null;
    }
    let { hours, minutes, seconds } = prevTime;

    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0) {
      seconds = 59;
      minutes--;
    } else if (hours > 0) {
      seconds = 59;
      minutes = 59;
      hours--;
    } else {
      clearInterval(timerRef.current as number);
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return { hours, minutes, seconds };
  });
}
