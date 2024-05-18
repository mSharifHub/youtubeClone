import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faUser,
  faSearch,
  faMicrophone,
} from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../components/forms/SearchInput';
import smartPlayIconPath from '../assets/navigation_icons/smart_play_logo.png';
import videoIconPath from '../assets/navigation_icons/add-video.png';
import bellIconPath from '../assets/navigation_icons/bell.png';

export default function NavigationBar() {
  return (
    <nav className="grid grid-cols-2 md:grid-cols-[0.5fr_1fr_0.5fr] grid-rows-1 h-10  justify-center items-center mb-2 mt-2  ">
      {/*left*/}
      <div className="col-span-1 col-start-1 row-start-1 row-span-1 flex justify-start items-center ">
        <div className="flex justify-center items-center mx-4">
          <FontAwesomeIcon icon={faBars} size="lg" className="mr-8" />
          {/* logo icon*/}
          <div>
            <img
              src={smartPlayIconPath}
              alt={smartPlayIconPath.split('/').pop()?.split('.')[0]}
              className="h-10 w-10  min-w-10"
            />
          </div>
          <span className="hidden md:flex  md:text-lg text-nowrap  text-neutral-600 font-black capitalize p-1 ">
            smart clips
          </span>
        </div>
      </div>
      {/*middle*/}
      <div className="col-span-1 col-start-2 row-start-1 row-span-1 flex justify-center items-center">
        <SearchInput />
      </div>
      {/*right*/}
      <div className="col-span-1 col-start-3  row-start-1 row-span-1  flex justify-end items-center px-4 space-x-6 ">
        {/* Add-video component content */}
        <div className="h-10 w-10 flex justify-center items-center rounded-full transition-transform duration-150 ease-out hover:border-2 hover:bg-neutral-200 cursor-pointer">
          <img
            src={videoIconPath}
            alt={videoIconPath.split('/').pop()?.split('.')[0]}
            className="min-w-7 min-h-7 w-7 h-7"
          />
        </div>
        {/* bell component content */}
        <div className="h-10 w-10 flex justify-center items-center rounded-full transition-transform duration-150 ease-out hover:border-2 hover:bg-neutral-200 cursor-pointer">
          <img
            src={bellIconPath}
            alt={videoIconPath.split('/').pop()?.split('.')[0]}
            className="min-w-8 min-h-8 w-8 h-8"
          />
        </div>
        {/* profile component content */}
        <div className="min-w-8 min-h-8  flex justify-center items-center rounded-full  hover:bg-neutral-200">
          <FontAwesomeIcon icon={faUser} className="text-black" />
        </div>
      </div>
      {/*sm: hidden components for microphone and search icons*/}
      <div className="col-start-2 col-span-1  row-start-1 flex  sm:hidden justify-end items-center space-x-4  ">
        <div className=" min-h-8 min-w-8 flex justify-center items-center rounded-full transition-transform duration-150 ease-out hover:border-2 hover:bg-neutral-200 cursor-pointer">
          <FontAwesomeIcon
            icon={faSearch}
            className="text-slate-300  text-xl "
          />
        </div>
        <div className="min-h-8 min-w-8 flex justify-center items-center rounded-full transition-transform duration-150 ease-out hover:border-2 hover:bg-neutral-200 cursor-pointer">
          <FontAwesomeIcon
            icon={faMicrophone}
            className="text-slate-300  text-xl "
          />
        </div>
      </div>
    </nav>
  );
}
