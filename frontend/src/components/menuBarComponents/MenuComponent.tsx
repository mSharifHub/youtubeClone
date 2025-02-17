import { Link } from 'react-router-dom';
import { useMenuBar } from './menuBarContext/MenuBarContext.ts';
import React from 'react';
interface MenuComponentProps {
  customIconSrc?: string;
  title: string;
  link: string;
  reverse?: boolean;
  isOffCanvas?: boolean;
  hidden?: boolean;
  homeMenuRef?: React.Ref<HTMLDivElement>;
  tabIndex?: number;
  onMouseEnter?: (
    event: React.MouseEvent<HTMLDivElement>,
    text: string,
  ) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MenuComponent({
  customIconSrc,
  title,
  link,
  reverse,
  isOffCanvas,
  hidden,
  onMouseEnter,
  onMouseLeave,
  homeMenuRef,
  tabIndex,
}: MenuComponentProps) {
  const { state } = useMenuBar();

  function handleMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (onMouseEnter) {
      onMouseEnter(event, title);
    }
  }

  return (
    <Link to={link}>
      <div
        ref={homeMenuRef}
        tabIndex={tabIndex}
        className={` ${hidden ? 'hidden' : 'flex'}  min-h-10 min-w-full items-center ${state.toggler && !isOffCanvas ? 'flex-col h-16 justify-center' : 'flex-row justify-start  px-5'} rounded-lg transition-colors duration-75 ease-out hover:bg-neutral-100  focus:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none dark:focus:bg-neutral-700 cursor-pointer `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={` flex justify-center items-center ${reverse ? 'order-2' : null} dark:invert  `}
        >
          {customIconSrc && (
            <img
              src={customIconSrc}
              alt={`${title}-icon`}
              className=" min-h-[24px] min-w-[24px] h-[24px] w-[24px]"
            />
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
