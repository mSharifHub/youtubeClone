import { UserProfileCard } from './UserProfileCard.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { useUserViewerPosts } from '../hooks/useUserViewerPosts.ts';
import { PostCard } from './PostCard.tsx';
import { PostNode, PostNodeEdge, useCreatePostMutation } from '../../graphql/types.ts';

type ImagePreviews = {
  file: File;
  url: string;
};

export default function UserChannel() {
  const [showUploadImagesModal, setShowUploadImagesModal] = useState<boolean>(false);
  const [isDraggingDropZone, setIsDraggingDropZone] = useState<boolean>(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreviews[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [clickedInput, setClickedInput] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(null);

  const mainDivRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userInputRef = useRef<HTMLInputElement | null>(null);
  const communityPostRef = useRef<HTMLFormElement>(null);

  const [createPost, { error: createPostError }] = useCreatePostMutation({
    update(cache, { data }) {
      const payload = data?.createPost;
      if (!payload?.post) return;

      cache.modify({
        fields: {
          viewerPosts(existing = { edges: [] }) {
            const newEdge = {
              __typename: 'PostNodeEdge',
              cursor: payload.cursor,
              node: {
                ...payload.post,
                __typename: 'PostNode',
              },
            };

            return {
              ...existing,
              edges: [newEdge as PostNodeEdge, ...existing.edges.filter((edge: PostNodeEdge) => edge?.node?.id !== payload.post?.id)],
            };
          },
        },
      });
    },
  });

  const { data, loading: userPostsLoading, sentinelRef } = useUserViewerPosts();

  const posts = data?.viewerPosts?.edges?.map((edge) => edge?.node).filter((node): node is PostNode => !!node) || [];

  const MAX_MB = 10 * 1024 * 1024;

  const MAX_UPLOADS = 10;

  enum FileMimeType {
    PNG = 'image/jpeg',
    JPG = 'image/jpg',
    JPEG = 'image/png',
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const acceptable_mime_type = Object.values(FileMimeType) as string[];

  const clearPost = () => {
    setClickedInput(false);
    setShowUploadImagesModal(false);
    setUserInput('');
    setImagePreviews([]);
    setError(undefined);
  };

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput && imagePreviews.length === 0) return;

    try {
      await createPost({
        variables: {
          content: userInput,
          images: imagePreviews ? imagePreviews.map((preview) => preview.file) : [],
        },
      });
    } catch {
      setError(createPostError?.message);
    }

    clearPost();
  };

  const handleShowDropZoneModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUploadImagesModal((prev) => !prev);
  };

  const handleDropZoneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    const previews = [...imagePreviews];
    let count = previews.length;
    let previousSize = previews.reduce((acc, curr) => acc + curr.file.size, 0);

    const acceptedFiles: { file: File; url: string }[] = [];
    const rejectedFiles: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size >= MAX_MB) {
        rejectedFiles.push(`${file.name}: is too large. Max size is 10MB`);
        continue;
      }
      if (!acceptable_mime_type.includes(file.type)) {
        rejectedFiles.push(`${file.name}: ${file.type} not supported`);
        continue;
      }
      if (count >= MAX_UPLOADS) {
        rejectedFiles.push(`${file.name}: max number of photos reached`);
        continue;
      }
      if (previousSize + file.size > MAX_MB) {
        rejectedFiles.push(`${file.name} : total size will exceed allowed limit`);
        continue;
      }

      acceptedFiles.push({ file, url: URL.createObjectURL(file) });
      previousSize += file.size;
      count += 1;
    }

    if (rejectedFiles.length > 0) {
      setError(`Rejected ${rejectedFiles.length} file${rejectedFiles.length > 1 ? 's' : ''}: ${rejectedFiles.join('\n ')}`);
    } else {
      setError(undefined);
    }

    setImagePreviews([...previews, ...acceptedFiles]);
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

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (clickedInput && userInputRef.current) {
      userInputRef.current.focus();
    }
  }, [clickedInput]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (mainDivRef.current && mainDivRef.current.contains(event.target as Node)) {
        if (communityPostRef.current && !communityPostRef.current.contains(event.target as Node)) {
          setClickedInput(false);
          setShowUploadImagesModal(false);
        }
      }
    };

    const parent = mainDivRef.current;

    if (parent) {
      parent.addEventListener('mousedown', handleClick);
    }

    return () => {
      if (parent) parent.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div ref={mainDivRef} className="h-screen  w-full relative  flex flex-col justify-start items-center p-8 gap-12 overflow-y-scroll overflow-hidden scroll-smooth ">
      <UserProfileCard />
      <form
        ref={communityPostRef}
        onClick={() => setClickedInput(true)}
        onSubmit={handlePost}
        className={`flex flex-col   h-fit  w-full  max-w-[800px] p-4 gap-4 rounded-lg border  dark:border-neutral-600  ${clickedInput ? 'bg-neutral-50 dark:bg-neutral-700 ' : 'dark:bg-neutral-900'}`}
      >
        {!creatingPost ? (
          <>
            <input
              type="text"
              ref={userInputRef}
              value={userInput}
              onChange={(e) => handleInputChange(e)}
              placeholder={clickedInput ? 'Share an image to start a caption contest' : ''}
              className={`w-full h-12 bg-transparent border-b border-neutral-300 dark:border-neutral-600 focus:outline-none text-base placeholder-neutral-400 dark:placeholder-neutral-500`}
            />
            {error && <div className="flex justify-center items-center text-sm  font-thin text-neutral-500">{error}</div>}

            {!showUploadImagesModal && (
              <section className="flex  flex-row h-10   gap-5 justify-start items-center">
                <div
                  onClick={() => {
                    handleShowDropZoneModal;
                    setShowUploadImagesModal(true);
                  }}
                  className=" flex px-4 h-full p-2  items-center gap-2 rounded-full  capitalize bg-white  dark:bg-transparent border  dark:border-none hover:bg-neutral-50 hover:dark:bg-neutral-600 hover:cursor-pointer"
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

            {showUploadImagesModal && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleDropZoneClick}
                className={` min-h-[400px] h-fit relative  flex flex-col justify-center items-center  rounded-xl border  ${isDraggingDropZone ? 'bg-blue-500 opacity-50' : 'bg-neutral-100 dark:bg-neutral-700 '} dark:border-neutral-600  hover:cursor-pointer`}
              >
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
                          <div className="h-full w-full border relative">
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearPost();
                }}
                className={`px-5 py-1.5 rounded-full ${!clickedInput ? 'hidden' : ' border bg-white dark:bg-neutral-600 dark:border-none'}  text-black dark:text-white`}
              >
                Cancel
              </button>
              <button
                disabled={!userInput && imagePreviews.length === 0}
                className={`px-5 py-1.5 rounded-full  text-white bg-blue-500 ${!userInput && imagePreviews.length === 0 && 'opacity-50 cursor-not-allowed'}`}
                type="submit"
              >
                Post
              </button>
            </div>
          </>
        ) : (
          <SpinningCircle />
        )}
      </form>

      <div className="flex flex-col h-fit w-full max-w-[800px] items-start gap-8  ">
        {posts.map((node) => (
          <PostCard key={`${node?.id}-${node?.__typename}`} post={node} />
        ))}
        {/* sentinel Ref*/}
        <div ref={sentinelRef} />
        {userPostsLoading && <SpinningCircle />}
      </div>
    </div>
  );
}
