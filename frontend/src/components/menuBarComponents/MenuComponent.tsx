import { Link } from 'react-router-dom';
import { useMenuBar } from './menuBarContext/MenuBarContext.ts';
import React from 'react';
interface MenuComponentProps {
  customIconSrc?: string;
  title: string;
  link: string;
  reverse?: boolean;
  isPath: (title: string) => boolean;
  isOffCanvas?: boolean;
  hidden?: boolean;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>, text: string) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MenuComponent({
  customIconSrc,
  title,
  link,
  reverse,
  isOffCanvas,
  hidden,
  isPath,
  onMouseEnter,
  onMouseLeave,
}: MenuComponentProps) {
  const { state } = useMenuBar();

  const isVisited = isPath(title);

  return (
    <Link to={link}>
      <div
        className={` ${hidden ? 'hidden' : 'flex'}  min-h-10 min-w-full items-center ${state.toggler && !isOffCanvas ? 'flex-col h-16 justify-center' : 'flex-row justify-start  px-5'} rounded-lg transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 ${isVisited ? 'bg-neutral-100 dark:bg-neutral-700' : ''} cursor-pointer `}
        onMouseEnter={(e) => onMouseEnter && onMouseEnter(e, title)}
        onMouseLeave={onMouseLeave}
      >
        <div className={` flex justify-center items-center ${reverse ? 'order-2' : null} dark:invert  `}>
          {customIconSrc && (
            <img src={customIconSrc} alt={`${title}-icon`} className=" min-h-[24px] min-w-[24px] h-[24px] w-[24px]" />
          )}
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
