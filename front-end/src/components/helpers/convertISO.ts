export const convertISO = (value: string) => {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  let currentNumber = '';

  if (value) {
    for (let i = 0; i < value.length; i++) {
      const char = value.charAt(i);

      if (!isNaN(parseInt(char, 10))) {
        currentNumber += char;
      } else {
        switch (char) {
          case 'H':
            hours = parseInt(currentNumber, 10);
            break;
          case 'M':
            minutes = parseInt(currentNumber, 10);
            break;
          case 'S':
            seconds = parseInt(currentNumber, 10);
            break;
          default:
            break;
        }
        currentNumber = '';
      }
    }
  }

  return {
    hours,
    minutes,
    seconds,
  };
};
