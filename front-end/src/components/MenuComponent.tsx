import { Link } from 'react-router-dom';
import { useMenuBar } from '../menuBarContext/MenuBarContext.ts';
interface MenuComponentProps {
  customIconSrc?: string;
  title: string;
  link: string;
  reverse?: boolean;
  isOffCanvas?: boolean;
}

export default function MenuComponent({
  customIconSrc,
  title,
  link,
  reverse,
  isOffCanvas,
}: MenuComponentProps) {
  const { state } = useMenuBar();

  return (
    <Link to={link}>
      <div
        className={`flex min-h-10 min-w-full items-center ${state.toggler && !isOffCanvas ? 'flex-col h-16 justify-center' : 'flex-row justify-start  px-5'} rounded-lg transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer `}
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
          className={`flex p-0.5  ${!reverse && 'mx-4'} whitespace-nowrap capitalize ${state.toggler && !isOffCanvas ? 'text-[8.5px]' : 'text-sm'}  ${reverse && !state.toggler && 'font-semibold'} `}
        >
          {title}
        </div>
      </div>
    </Link>
  );
}
