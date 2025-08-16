import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import Microphone from './Mircrophone.tsx';
import { ToolTip } from '../../helpers/ToolTip.tsx';
import { useToolTip } from '../hooks/useToolTip.ts';
import { useTheme } from '../../contexts/darkModeContext/ThemeContext.ts';

export default function SearchInput() {
  const { showTooltip, tooltipPosition, toolTipText } = useToolTip();
  const [userInput, setUserInput] = useState<string>('');

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setUserInput(value);
  };

  const clearUserInput = () => {
    setUserInput('');
  };

  const { theme } = useTheme();

  return (
    <div className="w-full h-full  hidden md:flex justify-center items-center  space-x-4 ">
      <div className="relative h-[2.5rem] w-full max-w-lg rounded-full border dark:border-none ">
        <input
          type="text"
          name="search-bar"
          id="search-bar"
          value={userInput}
          onChange={handleUserInputChange}
          placeholder="Search"
          className="h-full w-full p-2 pl-8 pr-10 rounded-full placeholder:font-thin placeholder:text-lg placeholder:text-slate-300 focus:outline-none dark:bg-neutral-800 "
        />
        {userInput.length > 0 && (
          <div className="absolute top-1/2 -translate-y-1/2 right-24 cursor-pointer" onClick={clearUserInput} title="Clear input">
            <FontAwesomeIcon icon={faX} size="lg" className="text-neutral-300" />
          </div>
        )}

        <div
          title="Search button"
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-16 h-full flex justify-center items-center   bg-neutral-100 dark:bg-neutral-800 rounded-r-full transition-colors duration-100 ease-in-out ${theme === 'dark' ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'} cursor-pointer`}
        >
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </div>
      </div>
      <div
        className={` min-h-10 min-w-10  flex justify-center items-center rounded-full bg-neutral-100 cursor-pointer transition-colors duration-100 ease-in-out ${theme === 'dark' ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}  dark:bg-neutral-800`}
        title="Search with your voice"
      >
        <Microphone />
      </div>

      <ToolTip visible={showTooltip} text={toolTipText} position={tooltipPosition} />
    </div>
  );
}
