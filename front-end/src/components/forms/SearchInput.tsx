import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Microphone from './Mircrophone.tsx';

export default function searchInput() {
  return (
    <div className="w-full h-full  hidden md:flex justify-center items-center  space-x-10 border-2">
      <div className="relative h-12 w-full max-w-lg rounded-full border-2 ">
        <input
          type="text"
          name="search-bar"
          id="search-bar"
          placeholder="Search"
          className="h-full w-full p-2 pl-8 pr-10 rounded-full placeholder:font-bold placeholder:text-lg placeholder:text-slate-300 focus:outline-none "
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[20%] h-full flex justify-center items-center  bg-slate-100 rounded-r-full">
          <FontAwesomeIcon icon={faSearch} size="xl" />
        </div>
      </div>
      <Microphone />
    </div>
  );
}
