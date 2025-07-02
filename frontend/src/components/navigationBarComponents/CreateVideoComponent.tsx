import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const CreateVideoComponent = () => {
  return (
    <div className="h-10 w-28  min-w-28  rounded-full transition-transform duration-150 ease-out  bg-neutral-100 hover:bg-neutral-200   dark:bg-neutral-800 dark:hover:bg-neutral-700  cursor-pointer ">
      <div className=" h-full w-full flex justify-center  items-center space-x-2 transition-transform duration-75 ease-in-out  hover:scale-110 ">
        <FontAwesomeIcon icon={faPlus} />
        <h1 className="text-sm font-semibold">Create</h1>
      </div>
    </div>
  );
};
