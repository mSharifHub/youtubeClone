import { decodeHtmlEntities } from '../../helpers/decodeHtmlEntities.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
// import { CommentThread } from '../hooks/useYoutubeComments.ts';
import { UserAvatar } from './UserAvatar.tsx';

interface CommentsThreadsProps {
  handleShowTopLevelReplies: () => void;
  showTopLevelReplies: boolean;
  // comments: CommentThread[];
  commentsError: string | null;
}

export const CommentsThreads: React.FC<CommentsThreadsProps> = ({ comments, handleShowTopLevelReplies, showTopLevelReplies }) => {
  return (
    <>
      <ul className="min-h-fit h-fit w-full flex p-4 flex-col  space-y-10 ">
        {comments.map((thread) => (
          <li key={thread.id}>
            {/* top level comment */}
            <div className="flex flex-row space-x-4 ">
              {/*Logo*/}
              <div className="flex justify-start p-2  ">
                <div className="flex flex-row space-x-2">
                  <UserAvatar userName={thread.snippet.topLevelComment.snippet.authorDisplayName} />
                </div>
              </div>
              <div className=" w-full flex flex-col  space-y-2  ">
                {/* Author */}
                <strong>{thread.snippet.topLevelComment.snippet.authorDisplayName}</strong>
                {/* Message Content */}
                <p className="w-full text-wrap">{decodeHtmlEntities(thread.snippet.topLevelComment.snippet.textDisplay)}</p>
                <div className="flex flex-row justify-start space-x-4">
                  <div className="flex flex-row justify-start space-x-2 ">
                    <FontAwesomeIcon icon={faThumbsUp} size="lg" className="rounded-full p-1.5 hover:dark-modal hover:cursor-pointer " />
                    <p>{thread.snippet.topLevelComment.snippet.likeCount > 0 ? thread.snippet.topLevelComment.snippet.likeCount : null}</p>
                  </div>
                  <div className="flex flex-row justify-start space-x-2 -scale-x-100 ">
                    <FontAwesomeIcon icon={faThumbsDown} size="lg" className="rounded-full p-1.5  hover:dark-modal hover:cursor-pointer " />
                  </div>
                </div>
              </div>
            </div>
            {thread.snippet.totalReplyCount > 0 && (
              <div className=" flex flex-col mx-20 mt-4 ">
                <button
                  onClick={handleShowTopLevelReplies}
                  className=" flex flex-row min-h-12 h-12 min-w-24 w-32 justify-center items-center space-x-4 rounded-full dark:hover:bg-blue-900 hover:bg-blue-200"
                >
                  <div className="min-w-fit flex flex-row space-x-2  justify-center items-center font-bold">
                    <FontAwesomeIcon icon={showTopLevelReplies ? faAngleUp : faAngleDown} />
                    <div className="flex flex-row space-x-2">
                      <p> {thread.snippet.totalReplyCount}</p>
                      <p>replies</p>
                    </div>
                  </div>
                </button>
                {/* replies */}
                {showTopLevelReplies && (
                  <ul className="space-y-4 p-2 ">
                    {thread.replies?.comments.map((reply, index) => (
                      <li key={index} className="flex flex-row space-x-4">
                        <div className="flex justify-start p-2">
                          <UserAvatar userName={reply.authorDisplayName} />
                        </div>
                        <div className="flex flex-col">
                          <strong>{reply.authorDisplayName}</strong>
                          <p>{decodeHtmlEntities(reply.textDisplay)}</p>
                          <div className="flex flex-row justify-start items-center space-x-4 ">
                            <div className="flex flex-row justify-center items-center space-x-2 ">
                              <FontAwesomeIcon icon={faThumbsUp} size="sm" className="rounded-full p-1.5 hover:dark-modal hover:cursor-pointer" />
                              <p>{reply.likeCount > 0 ? reply.likeCount : null}</p>
                            </div>
                            <div className="flex flex-row justify-start space-x-2 -scale-x-100">
                              <FontAwesomeIcon icon={faThumbsDown} size="sm" className="rounded-full p-1.5 hover:dark-modal hover:cursor-pointer" />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
