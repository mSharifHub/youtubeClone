import monkeyImage from '../../assets/menu_bar_icons/monkey.png';
import logoPath from '../../assets/navigation_icons/youtube-logo.png';
import { useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();
  const pathname = location.pathname as string;

  return (
    <div className="h-screen w-screen  bg-white dark:bg-neutral-900">
      <div className="container mx-auto h-full flex flex-col justify-center items-center  ">
        <img src={monkeyImage} alt="404-monkey" className="size-[12rem]" />
        <span className="mt-5 text-md  font-black  text-center text-neutral-500 dark:text-white">
          <span className="inline-block px-2">
            '{pathname.split('/').pop()}'
          </span>
          isn't available. Sorry about that. Try searching for something else.
        </span>
        <div className="flex flex-row h-12 w-full justify-center items-center mt-8  md:space-x-8">
          <div className="flex flex-row justify-center items-center">
            <img
              src={logoPath}
              alt={logoPath.split('/').pop()?.split('.')[0]}
              className="min-h-full  w-[4rem] min-w-[4rem]"
            />
            <h1 className="hidden md:flex font-bold text-xl">YouTube</h1>
          </div>
          <input
            id="search-bar-404"
            name="search-bar-404"
            placeholder="search again"
            className="h-10 min-w-[20rem] border-2 rounded-lg placeholder:capitalize placeholder:font-bold placeholder:text-neutral-300 px-4"
          />
        </div>
      </div>
    </div>
  );
}
