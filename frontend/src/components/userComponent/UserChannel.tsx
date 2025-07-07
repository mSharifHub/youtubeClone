import { UserProfileCard } from './UserProfileCard.tsx';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce.ts';

type ImagePreviews = {
  file: File;
  url: string;
};

type Post = {
  id: string;
  input: string;
  pictures: FileList | File[];
  timePosted: Date;
};

export default function UserChannel() {
  const {
    state: { user },
  } = useUser();

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isDraggingDropZone, setIsDraggingDropZone] = useState<boolean>(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreviews[]>([]);
  const [userInput, setUserInput] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [userPost, setUserPost] = useState<Post>({
    id: Math.random().toString(16).substring(2),
    input: '',
    pictures: [],
    timePosted: new Date(),
  });

  const MAX_MB = 10 * 1024 * 1024;

  const MAX_UPLOADS = 10;

  enum FileMimeType {
    PNG = 'image/jpeg',
    JPG = 'image/jpg',
    JPEG = 'image/png',
  }

  const acceptable_mime_type = Object.values(FileMimeType) as string[];

  const handleShowDropZoneModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUploadModal((prev) => !prev);
  };

  const handleDropZoneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    const previews = [...imagePreviews];

    const newFiles = Array.from(files).filter((file) => {
      return file.size <= MAX_MB && acceptable_mime_type.includes(file.type) && file.size > 0;
    });

    let previousSize = previews.reduce((acc, curr) => acc + curr.file.size, 0);
    for (const file of newFiles) {
      if (previousSize + file.size > MAX_MB || imagePreviews.length >= MAX_UPLOADS) {
        return setError('Can not exceed 10MB or 10 pictures');
      }
      const url = URL.createObjectURL(file);
      previousSize += file.size;
      previews.push({ file, url });
    }
    setImagePreviews(previews);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
    setIsDraggingDropZone(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingDropZone(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingDropZone(false);
  };

  const handleRemoveFile = ({ index, event }: { index: number; event: React.MouseEvent<HTMLButtonElement> }) => {
    event.stopPropagation();
    setImagePreviews((prev) => {
      if (prev.length === 0) return prev;
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const debouncedInput = useDebounce((value: string) => {
    setUserInput(value);
  }, 500);

  // const handleOnPostSubumit = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (imagePreviews && imagePreviews.length > 0) {
  //     const files = [...imagePreviews];
  //   }
  // };

  const clearPost = () => {
    setImagePreviews([]);
    setShowUploadModal(false);
  };

  useEffect(() => {
    if (error) {
      if (imagePreviews.length < MAX_MB) {
        setError(null);
      }
    }
  }, [imagePreviews.length]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  return (
    <div className="h-screen  flex flex-col justify-start items-center p-8 gap-12 overflow-y-scroll overflow-hidden scroll-smooth">
      <section className="flex flex-col justify-start items-start gap-8">
        <UserProfileCard />
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-fit w-[80vw] max-w-[800px] p-4 gap-4 rounded-lg border  dark:border-neutral-600 dark:bg-neutral-800">
          <div className="flex flex-row justify-start items-center gap-4">
            <div>{user && user.profilePicture && <img src={user.profilePicture} alt={`${user?.username}-profilePicture`} className="rounded-full min-h-8 min-w-8 w-8 h-8" />}</div>
            <h3>
              {user?.firstName} {user?.lastName}
            </h3>
          </div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => debouncedInput(e.target.value)}
            placeholder="Share something with your fans..."
            className="w-full h-12 bg-transparent border-b border-neutral-300 dark:border-neutral-600 focus:outline-none text-base placeholder-neutral-400 dark:placeholder-neutral-500"
          />

          <p>Live value: {liveValue}</p>
          <p>Debounced value: {userInput}</p>

          {!showUploadModal && (
            <section className="flex  flex-row h-10  gap-5 justify-start items-center">
              <div
                onClick={handleShowDropZoneModal}
                className=" flex px-4 h-full  items-center gap-2 rounded-full  capitalize bg-transparent hover:bg-neutral-200 hover:dark:bg-neutral-700 hover:cursor-pointer"
              >
                <FontAwesomeIcon icon={faImage} className="text-lg" />
                image
              </div>
              {imagePreviews.length > 0 && (
                <h3 className="text-sm text-gray-500">
                  {imagePreviews.length} {imagePreviews.length === 1 ? 'file' : 'files'} attached
                </h3>
              )}
            </section>
          )}

          {showUploadModal && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleDropZoneClick}
              className={` min-h-[400px] h-fit relative flex flex-col justify-center items-center  rounded-xl border  ${isDraggingDropZone ? 'bg-blue-500 opacity-50' : 'bg-neutral-100 dark:bg-neutral-700 '} dark:border-neutral-600  hover:cursor-pointer`}
            >
              {error && <div>{error}</div>}

              {imagePreviews.length > 0 && (
                <div className="relative flex w-full aspect-square  p-8 justify-center items-center">
                  {imagePreviews.map((preview, index) => {
                    const rotateAngle = index % 2 === 0 ? 'rotate-6' : '-rotate-6';
                    const closeButtonIndex = index % 2 === 0 ? 'right-0 top-0' : 'left-0 top-0 ';
                    const zIndex = 10 + index;
                    return (
                      <div
                        key={preview.file.name}
                        onAnimationStartCapture={(e) => e.stopPropagation()}
                        className={`absolute ${imagePreviews.length > 1 ? `${rotateAngle}` : ''} flex justify-center items-center h-[80%] w-[80%] max-h-[80%] max-w-[80%]  `}
                        style={{ zIndex }}
                      >
                        <div className="h-full w-full relative">
                          <button onClick={(event) => handleRemoveFile({ index, event })} className={` absolute  ${closeButtonIndex} h-10 w-10  `}>
                            <FontAwesomeIcon icon={faX} className="text-2xl h-10 w-10 text-white  " />
                          </button>
                          <img src={preview.url} alt={preview.file.name} className=" h-full w-full object-cover" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div
                onClick={handleShowDropZoneModal}
                className="absolute -top-4 -right-2 h-10 w-10 flex justify-center items-center rounded-full  border    bg-white shadow  dark:border-0 dark:bg-neutral-900 cursor-pointer opacity-70"
              >
                <FontAwesomeIcon icon={faMinus} className=" font-thin" />
              </div>

              <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileInputChange} ref={fileInputRef} />

              {imagePreviews.length === 0 && (
                <div className="flex flex-col  h-full w-full justify-center items-center gap-4 ">
                  <FontAwesomeIcon icon={faImage} className="text-4xl" />
                  <h3 className="text-xs text-center">Click on drop area to drag image(s) or select from your computer</h3>
                </div>
              )}
            </div>
          )}

          <div className=" flex justify-end gap-8">
            <button onClick={clearPost} className="px-5 py-1.5 rounded-full  ">
              cancel
            </button>
            <button className="px-5 py-1.5 rounded-full border ">Post</button>
          </div>
        </form>
      </section>
    </div>
  );
}
