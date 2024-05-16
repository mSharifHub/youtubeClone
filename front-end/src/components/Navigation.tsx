import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../components/forms/SearchInput';

export default function NavigationBar() {
  return (
    <div className="grid grid-cols-[0.5fr_1fr_0.5fr] h-20 border-2">
      {/*left hand side*/}
      <div className="col-span-1 col-start-1 flex justify-start items-center border-2">
        <div className="flex justify-center items-center mx-4">
          <FontAwesomeIcon icon={faBars} size="2xl" className="mr-8" />
          <FontAwesomeIcon icon={faYoutube} className="text-3xl text-red-600" />
          <span className="text-3xl font-black capitalize p-1 ">Youtube</span>
        </div>
      </div>
      {/*middle*/}
      <div className="col-span-1 col-start-2 flex justify-center items-center">
        <SearchInput />
      </div>
    </div>
  );
}
