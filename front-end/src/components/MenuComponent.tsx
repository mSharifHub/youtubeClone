import { Link } from 'react-router-dom';
import { useMenuBar } from '../menuBarContext/MenuBarContext.ts';
interface MenuComponentProps {
  customIconSrc?: string;
  title: string;
  link: string;
  reverse?: boolean;
}

export default function MenuComponent({
  customIconSrc,
  title,
  link,
  reverse,
}: MenuComponentProps) {
  const { state } = useMenuBar();

  return (
    <Link to={link}>
      <div
        className={`flex min-h-10 items-center ${state.toggler ? 'flex-col h-16  w-auto justify-center' : 'flex-row justify-start  w-[90%] px-5'} rounded-lg transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer `}
      >
        <div
          className={` flex justify-center items-center ${reverse && !state.toggler ? 'order-2' : null} dark:invert  `}
        >
          {customIconSrc && (
            <img
              src={customIconSrc}
              alt={`${title}-icon`}
              className="h-[24px] w-[24px]"
            />
          )}
        </div>
        <div
          className={`flex p-0.5  ${!reverse && 'mx-4'} whitespace-nowrap capitalize ${state.toggler ? 'text-[8.5px]' : 'text-sm'}  ${reverse && !state.toggler && 'font-semibold'} `}
        >
          {title}
        </div>
      </div>
    </Link>
  );
}
