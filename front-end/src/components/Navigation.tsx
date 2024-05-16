import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import {
  faBars,
  faVideo,
  faBell,
  faUser,
  faSearch,
  faMicrophone,
} from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../components/forms/SearchInput';

export default function NavigationBar() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-[0.5fr_1fr_0.5fr] grid-rows-1 h-20 ">
      {/*left*/}
      <div className="col-span-1 col-start-1 row-start-1 row-span-1 flex justify-start items-center ">
        <div className="flex justify-center items-center mx-4">
          <FontAwesomeIcon icon={faBars} size="xl" className="mr-8" />
          <FontAwesomeIcon icon={faYoutube} className="text-3xl text-red-600" />
          <span className="hidden md:flex text-3xl font-black capitalize p-1 ">
            Youtube
          </span>
        </div>
      </div>
      {/*middle*/}
      <div className="col-span-1 col-start-2 row-start-1 row-span-1 flex justify-center items-center">
        <SearchInput />
      </div>
      {/*right*/}
      <div className="col-span-1 col-start-3  row-start-1 row-span-1  flex justify-end items-center px-4 space-x-8 ">
        <FontAwesomeIcon icon={faVideo} className="text-slate-300  text-xl" />
        <FontAwesomeIcon icon={faBell} className="text-slate-300 text-xl " />
        <div className="min-w-8 min-h-8 flex justify-center items-center border-2 rounded-full bg-slate-300">
          <FontAwesomeIcon icon={faUser} className="text-white  text-xl" />
        </div>
      </div>
      {/*sm:*/}
      <div className="col-start-2 col-span-1  row-start-1 flex  sm:hidden justify-end items-center space-x-8 px-8  ">
        <FontAwesomeIcon icon={faSearch} className="text-slate-300  text-xl " />
        <FontAwesomeIcon
          icon={faMicrophone}
          className="text-slate-300  text-xl "
        />
      </div>
    </div>
  );
}
