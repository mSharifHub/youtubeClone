import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

export default function Microphone() {
  return (
    <div className=" min-w-[2.5rem] min-h-[2.5rem] flex justify-center items-center  transition-colors duration-150 rounded-full hover:bg-neutral-200 cursor-pointer">
      <FontAwesomeIcon
        icon={faMicrophone}
        size="lg"
        className="text-black p-2"
      />
    </div>
  );
}
