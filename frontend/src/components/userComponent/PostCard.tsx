import { PostNode } from '../../graphql/types.ts';
import timeSince from '../../helpers/timeSince.ts';

export const PostCard = ({ post }: { post: PostNode }) => {
  return (
    <div className="min-h-24 w-full  flex flex-row p-4  gap-4 border dark:border-neutral-600 rounded-xl ">
      <div className=" shrink-0 h-fit">
        {post?.profilePicture && <img className="rounded-full min-h-10 min-w-10 w-10 h-10" src={post?.profilePicture} alt={post?.profilePicture} />}
      </div>
      <div className="w-full flex flex-1 flex-col gap-4">
        <div className="flex flex-row w-full  gap-4 text-sm ">
          <h3 className="font-bold">{post?.author.youtubeHandler}</h3>
          <h3 className="text-neutral-900 dark:text-neutral-400">{timeSince(post?.createdAt)}</h3>
        </div>
        {post?.content && <p className="w-full break-words whitespace-pre-wrap">{post?.content}</p>}
        {post?.images &&
          post.images.length > 0 &&
          post.images.map((imageObj) => {
            const imgSrc = imageObj?.image
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
