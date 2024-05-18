import monkeyImage from '../../assets/menu_bar_icons/monkey.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function NotFound() {
  return (
    <div className="h-screen w-screen">
      <div className="container mx-auto h-full flex flex-col justify-center items-center">
        <img src={monkeyImage} alt="404-monkey" className="size-[15rem]" />
        <span className="mt-10 text-lg  font-black  text-center">
          This page isn't available. Sorry about that. Try searching for
          something else.
        </span>
        <div className="flex flex-row justify-center items-center mt-8">
          <span>
            <FontAwesomeIcon
              icon={faYoutube}
              className="text-8xl text-red-500 "
            />
          </span>
          <span className="text-6xl font-black capitalize p-1 ">Youtube</span>
        </div>
      </div>
    </div>
  );
}
