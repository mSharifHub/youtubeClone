import monkeyImage from '../../assets/menu_bar_icons/monkey.png';
import logoPath from '../../assets/navigation_icons/youtube-logo.png';
import { useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();
  const pathname = location.pathname as string;

  return (
    <div className="h-screen w-screen">
      <div className="container mx-auto h-full flex flex-col justify-center items-center ">
        <img src={monkeyImage} alt="404-monkey" className="size-[15rem]" />
        <span className="mt-10 text-lg  font-black  text-center">
          <span className="inline-block">'{pathname}'</span> isn't available.
          Sorry about that. Try searching for something else.
        </span>
        <div className="flex flex-row h-12 w-full justify-center items-center mt-8 ">
          <div>
            <img
              src={logoPath}
              alt={logoPath.split('/').pop()?.split('.')[0]}
              className="min-h-full h-full  w-[4rem] min-w-[4rem]"
            />
          </div>
          <input
            id="search-bar-404"
            name="search-bar-404"
            placeholder="search again"
            className="h-full  w-[50%] border-2 rounded-lg placeholder:capitalize placeholder:font-bold placeholder:text-neutral-300 px-4"
          />
        </div>
      </div>
    </div>
  );
}
