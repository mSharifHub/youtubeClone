import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

export default function Microphone() {
  return (
    <div className=" min-w-[3rem] min-h-[3rem] flex justify-center items-center rounded-full bg-slate-200">
      <FontAwesomeIcon icon={faMicrophone} size="xl" className="text-black" />
    </div>
  );
}
