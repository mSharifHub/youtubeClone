import ReactModal from 'react-modal';
import React from 'react';
import { socialMediaArray } from '../../helpers/socialMediaArray.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

interface ShareModalProps {
  isOpenShareModal: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpenShareModal, onClose }) => {
  const videoAddress = window.location.href;

  const handleCopyUrl = () => {
    if (videoAddress) {
      navigator.clipboard.writeText(videoAddress);
    }
  };

  return (
    <ReactModal
      isOpen={isOpenShareModal}
      onRequestClose={onClose}
      closeTimeoutMS={100}
      overlayClassName={`fixed inset-0 flex justify-center items-center bg-neutral-950  transition duration-500 ease-in-out ${isOpenShareModal ? 'bg-opacity-30' : 'bg-opacity-0'}  z-10 `}
      style={{ content: { outline: 'none' } }}
      className={'flex flex-col  relative justify-start items-start bg-white  p-10  gap-4 dark:bg-neutral-800  h-[80vh] max-h-[450px] w-[80vw] max-w-[500px] rounded-xl'}
    >
      <div onClick={onClose} className="absolute top-3 right-5 p-2 cursor-pointer">
        <FontAwesomeIcon icon={faX} className="font-thin  text-xl" />
      </div>

      <div className="flex justify-center items-center p-1   mt-6 w-full">
        <button className="px-4  py-2 rounded-full  border border-black bg-neutral-200 dark:bg-neutral-300  dark:text-black">Create post</button>
      </div>
      <div className="w-full border-t-[0.5px] border-t-black dark:border-t-white" />
      <span className="capitalize  font-extralight  w-full">share</span>
      <div className=" w-full flex flex-row  justify-around overflow-x-scroll scroll-smooth no-scrollbar items-center gap-12 mb-4 ">
        {socialMediaArray.map((social) => {
          const PlatFormIcon = social.icon;
          const PlatFormShareButton = social.shareButton;
          const quote = `Hello ${social.name}, check this video on my youtubeClone 🔥🔥🔥`;
          return (
            <PlatFormShareButton key={social.name} url={videoAddress} quote={quote} className="flex flex-col items-center  gap-2 cursor-pointer">
              <PlatFormIcon size={64} round={true} />
              <div className="text-center w-full ">{social.name}</div>
            </PlatFormShareButton>
          );
        })}
      </div>
      <form className="w-full relative">
        <label>
          <input
            type="url"
            value={window.location.href}
            readOnly={true}
            className="w-full h-12 px-4 py-2  rounded-lg border  border-neutral-500 dark:border-neutral-500  bg-neutral-200 dark:bg-neutral-900 focus:outline-none dark:focus:border-neutral-700"
          />
          <div onClick={handleCopyUrl} className="absolute top-1/2 -translate-y-1/2 right-2 rounded-full px-4 py-1  cursor-pointer bg-blue-500 text-white dark:text-black">
            copy
          </div>
        </label>
      </form>
    </ReactModal>
  );
};
