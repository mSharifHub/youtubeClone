import { UserProfileCard } from './UserProfileCard.tsx';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import React, { useEffect, useRef, useState } from 'react';

type ImagePreviews = {
  file: File;
  url: string;
};

export default function UserChannel() {
  const {
    state: { user },
  } = useUser();

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreviews[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const MAX_SIZE = 10 * 1024 * 1024;
  const handleUploadImageModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUploadModal((prev) => !prev);
  };

  const handleDropZoneClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    const previews = [...imagePreviews];

    const newFiles = Array.from(files).filter((file) => {
      return file.type.match('image.*');
    });

    let previousSize = previews.reduce((acc, curr) => acc + curr.file.size, 0);
    for (const file of newFiles) {
      if (previousSize + file.size > MAX_SIZE) {
        return setError('File size exceeds 10MB');
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
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  useEffect(() => {
    if (imagePreviews) {
      console.log(imagePreviews);
    }
  }, [imagePreviews]);

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
            placeholder="Share something with your fans..."
            className="w-full h-12 bg-transparent border-b border-neutral-300 dark:border-neutral-600 focus:outline-none text-base placeholder-neutral-400 dark:placeholder-neutral-500"
          />

          {!showUploadModal && (
            <section className="flex  flex-row h-10  justify-start items-center">
              <div
                onClick={handleUploadImageModal}
                className=" flex px-4 h-full  items-center gap-2 rounded-full  capitalize bg-transparent hover:bg-neutral-200 hover:dark:bg-neutral-700 hover:cursor-pointer"
              >
                <FontAwesomeIcon icon={faImage} className="text-lg" />
                image
              </div>
            </section>
          )}

          {showUploadModal && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleDropZoneClick}
              className={`h-80  relative flex flex-col justify-center items-center  rounded-xl border   dark:border-neutral-600  bg-neutral-100 dark:bg-neutral-700 hover:cursor-pointer`}
            >
              {isDragging && <div className="absolute inset-0 rounded-lg bg-blue-500 opacity-50 w-full h-full" />}

              <div
                onClick={handleUploadImageModal}
                className="absolute -top-4 -right-2 h-10 w-10 flex justify-center items-center rounded-full  border    bg-white shadow  dark:border-0 dark:bg-neutral-900 cursor-pointer opacity-70"
              >
                <FontAwesomeIcon icon={faX} className="text-xl font-thin" />
              </div>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileInputChange} ref={fileInput} />
              <div className=" flex flex-col justify-center items-center gap-4">
                <FontAwesomeIcon icon={faImage} className="text-4xl" />
                <h3 className="text-sm">Click or drag image(s) from your computer</h3>
              </div>
            </div>
          )}

          <div className=" flex justify-end gap-8">
            <button className="px-5 py-1.5 rounded-full  ">cancel</button>
            <button className="px-5 py-1.5 rounded-full border ">Post</button>
          </div>
        </form>
      </section>
    </div>
  );
}
