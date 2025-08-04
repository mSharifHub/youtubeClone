import { Link } from 'react-router-dom';
import { useMenuBar } from '../../contexts/menuBarContext/MenuBarContext.ts';
import React from 'react';
interface MenuComponentProps {
  customIconSrc?: string;
  title: string;
  link: string;
  reverse?: boolean;
  isPath: (title: string) => boolean;
  isOffCanvas?: boolean;
  hidden?: boolean;
  menuItemHovered?: boolean;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>, text: string) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MenuComponent({ customIconSrc, title, link, reverse, isOffCanvas, hidden, isPath, onMouseEnter, onMouseLeave, menuItemHovered }: MenuComponentProps) {
  const { state } = useMenuBar();

  const isCurrentPath: boolean = isPath(title);

  const handleOnMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter && onMouseEnter(e, title);
  };

  const handleOnMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave && onMouseLeave(e);
  };

  return (
    <Link to={link}>
      <div
        className={` ${hidden ? 'hidden' : 'flex'}  min-h-10 min-w-full items-center ${state.toggler && !isOffCanvas ? 'flex-col h-16 justify-center' : 'flex-row justify-start  px-5'} rounded-lg transition-colors duration-75 ease-out 
         ${isCurrentPath && !menuItemHovered ? 'bg-neutral-200 dark:bg-neutral-700' : 'hover:bg-neutral-200 hover:dark:bg-neutral-700'}  cursor-pointer`}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <div className={` flex justify-center items-center ${reverse ? 'order-2' : null} dark:invert  `}>
          {customIconSrc && <img src={customIconSrc} alt={`${title}-icon`} className=" min-h-[24px] min-w-[24px] h-[24px] w-[24px]" />}
        </div>
        <div
          className={` p-0.5 capitalize ${!state.toggler && !reverse ? 'mx-4' : null} ${state.toggler && !isOffCanvas ? 'text-[8.5px]' : 'text-sm'}  ${reverse && state.toggler && !isOffCanvas ? 'hidden' : 'flex'} `}
        >
          {title}
        </div>
      </div>
    </Link>
  );
}
