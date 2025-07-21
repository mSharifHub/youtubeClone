import { PostNode } from '../../graphql/types.ts';
import timeSince from '../../helpers/timeSince.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useEditPost } from '../hooks/useEditPost.ts';
import { useDeletePost } from '../hooks/useDeletePost.ts';

export const PostCard = ({ post }: { post: PostNode }) => {
  const editModalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showEditInput, setShowEditInput] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');

  const { editPost } = useEditPost();

  const { deletePost } = useDeletePost();

  const handleShowEditModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setShowEditModal(true);
  };

  const handleShowEditInput = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setShowEditInput(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleEditInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await editPost({
      variables: {
        postId: post.id,
        content: userInput,
      },
    });

    setShowEditModal(false);
    setShowEditInput(false);
    setUserInput('');
  };

  const handleDeletePost = async () => {
    await deletePost({
      variables: {
        postId: post.id,
      },
    });
  };

  useEffect(() => {
    const handleEditModalClick = (event: MouseEvent) => {
      if (editModalRef.current && !editModalRef.current.contains(event.target as Node)) {
        if (triggerRef.current && triggerRef.current.contains(event.target as Node)) return;
        setShowEditModal(false);
      }
    };

    document.addEventListener('mousedown', handleEditModalClick);

    return () => document.removeEventListener('mousedown', handleEditModalClick);
  }, []);

  const EditModal = () => {
    return (
      <div
        ref={editModalRef}
        className="absolute -right-4 top-12  h-20 w-32 p-3 flex flex-col justify-between rounded-xl  bg-white border dark:bg-neutral-800 dark:border-none z-10 "
      >
        <h3 onClick={handleShowEditInput} className="flex flex-row h-full w-full  justify-start items-center gap-3  rounded-md hover:dark:bg-neutral-700 cursor-pointer">
          <FontAwesomeIcon icon={faPencil} />
          Edit
        </h3>
        <h3 onClick={handleDeletePost} className="flex flex-row h-full w-full justify-start items-center gap-3  rounded-md   hover:dark:bg-neutral-700 cursor-pointer">
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </h3>
      </div>
    );
  };

  const EllipsisOption = () => {
    return (
      <div ref={triggerRef} onClick={handleShowEditModal} className="absolute right-0 top-0 p-1 ">
        <FontAwesomeIcon icon={faEllipsis} className=" text-lg  rotate-90" />
      </div>
    );
  };

  const ProfilePicture = () => {
    return post?.profilePicture && <img className="rounded-full min-h-10 min-w-10 w-10 h-10" src={post?.profilePicture} alt={post?.profilePicture} />;
  };

  const PostMetaData = () => {
    return (
      <div className="flex flex-row w-full  gap-4 text-sm ">
        <h3 className="font-bold">{post?.author.youtubeHandler}</h3>
        <h3 className="text-neutral-900 dark:text-neutral-400">{timeSince(post?.createdAt)}</h3>
      </div>
    );
  };

  const CancelEdit = () => {
    return (
      <button
        onClick={() => {
          setShowEditModal(false);
          setShowEditInput(false);
        }}
        className="px-3 py-1.5 rounded-full bg-neutral-100 dark:dark-modal dark:hover:bg-neutral-700 hover:bg-neutral-200"
      >
        cancel
      </button>
    );
  };

  const SaveEdit = () => {
    return (
      <button type="submit" disabled={!userInput} className={`px-5 py-1.5 rounded-full  text-white bg-blue-500 ${!userInput && 'opacity-50 cursor-not-allowed'} `}>
        save
      </button>
    );
  };

  return (
    <div className=" relative min-h-24 w-full  flex flex-col p-4  gap-4 border dark:border-neutral-600 rounded-xl ">
      {showEditModal && !showEditInput && <EditModal />}
      <div className=" relative  flex flex-row   gap-4">
        <EllipsisOption />
        <ProfilePicture />
        <PostMetaData />
      </div>
      <div className="w-full flex flex-1 flex-col gap-4">
        {!showEditInput ? (
          <p className="w-full break-words whitespace-pre-wrap">{post?.content}</p>
        ) : (
          <form onSubmit={handleEditInput} className="flex flex-col gap-6">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className={`w-full h-12 bg-transparent border-b border-neutral-300 dark:border-neutral-600 focus:outline-none text-base placeholder-neutral-400 dark:placeholder-neutral-500`}
            />
            <div className="flex flex-row gap-4">
              <CancelEdit />
              <SaveEdit />
            </div>
          </form>
        )}
      </div>
      <div>
        {post?.images &&
          post.images.length > 0 &&
          post.images.map((imageObj) => {
            const imgSrc = imageObj?.image;
            if (!imgSrc) return null;
            if (post.images?.length === 1) {
              return (
                <div className="" key={`${post?.id}-${post?.__typename}`}>
                  <img className="rounded-lg " src={imgSrc} alt={`post-image-${post?.id}`} />
                </div>
              );
            } else {
              return (
                <div className="grid grid-cols grid-rows grid-flow-row" key={`${post?.id}-${post?.__typename}`}>
                  <img className="rounded-lg " src={imgSrc} alt={`post-image-${post?.id}`} />
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};
