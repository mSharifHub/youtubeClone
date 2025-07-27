import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import YouTube, { YouTubeProps } from 'react-youtube';
import { decodeHtmlEntities } from '../../helpers/decodeHtmlEntities.ts';
import { formatNumber } from '../../helpers/formatNumber.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as faBellSolid, faShare } from '@fortawesome/free-solid-svg-icons';
import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown as faThumbsDownRegular, faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown as faThumbsDownSolid, faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { getVideoId } from '../../helpers/getVideoId.ts';

export default function VideoCardPlayer({
  YoutubeComponent,
  opts,
  onReady,
  handleExpandVideoDescription,
  handleOpenShareModal,
  expandVideoDescription,
  liked,
  dislike,
  handleLike,
  animateLike,
  subscribed,
  handleDislike,
  handleSubscribe,
  animateRing,
}: {
  YoutubeComponent: typeof YouTube;
  opts: YouTubeProps['opts'];
  onReady: YouTubeProps['onReady'];
  handleExpandVideoDescription: () => void;
  handleOpenShareModal: () => void;
  expandVideoDescription: boolean;
  liked: boolean;
  dislike: boolean;
  animateLike: boolean;
  animateRing: boolean;
  subscribed: boolean;
  handleLike: () => void;
  handleDislike: () => void;
  handleSubscribe: () => void;
}) {
  const { selectedVideo } = useSelectedVideo();
  const likeCount = Number(selectedVideo?.statistics?.likeCount);
  const dislikeCount = Number(selectedVideo?.statistics?.dislikeCount);

  return (
    <div className="min-h-fit h-fit w-full flex flex-col justify-start items-start gap-8   rounded-lg">
      <div className="relative flex  flex-none w-full  min-h-[250px]   aspect-video ">
        {selectedVideo ? (
          <YoutubeComponent videoId={getVideoId(selectedVideo.id)} opts={opts} onReady={onReady} iframeClassName="absolute inset-0 h-full  w-full rounded-xl" />
        ) : (
          <div className="h-full  w-full bg-neutral-200 dark:dark-modal  animate-wave-opacity rounded-lg" />
        )}
      </div>
      {!selectedVideo ? (
        <div className="flex flex-col w-full gap-10">
          <div className="flex flex-row w-full space-x-8">
            <div className=" min-h-10 min-w-10 h-14 w-14  flex-none rounded-full bg-neutral-200 dark:dark-modal  animate-wave-opacity" />
            <div className=" flex flex-col w-full space-y-2 ">
              <div className=" h-6  w-full rounded bg-neutral-200 dark:dark-modal  animate-wave-opacity  " />
              <div className=" h-6  w-1/2 rounded bg-neutral-200 dark:dark-modal  animate-wave-opacity  " />
            </div>
          </div>
          <div className="h-20 w-full rounded bg-neutral-200 dark:dark-modal  animate-wave-opacity" />
        </div>
      ) : (
        <section className=" flex flex-col min-h-fit w-full p-4 space-y-4 ">
          {/* first-column */}
          <div className="flex-1 justify-start items-center">
            <h1 className="font-bold text-lg text-wrap "> {decodeHtmlEntities(selectedVideo?.snippet.title)}</h1>
          </div>
          {/* second-column */}
          <div className=" flex flex-row flex-wrap  gap-3">
            <div className="flex justify-start items-center gap-4 grow ">
              <img
                src={selectedVideo?.snippet.channelLogo}
                alt={selectedVideo?.snippet.channelTitle}
                className="h-14 w-14 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                loading="lazy"
              />
              <div className="flex flex-col">
                <h1 className="font-bold text-base text-gray-800 dark:text-gray-100 truncate">{decodeHtmlEntities(selectedVideo.snippet.channelTitle)}</h1>
                <div className=" flex flex-row items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatNumber(Number(selectedVideo.snippet.subscriberCount))}</span>
                  <span>subscribers</span>
                </div>
              </div>
              <button
                onClick={handleSubscribe}
                className={`flex flex-none justify-center items-center  h-10 w-36  text-nowrap  text-xs  font-bold  bg-neutral-200 dark:bg-neutral-800 rounded-full  border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700`}
              >
                <FontAwesomeIcon icon={subscribed ? faBellSolid : faBellRegular} className={`text-lg ${animateRing ? 'animate-belt-swing ' : ''}`} />
                <h3 className=" w-20">{subscribed ? <span>subscribed</span> : <span> subscribe</span>}</h3>
              </button>
            </div>
            <div className="flex justify-end items-center gap-4 ">
              <div className={'flex items-center bg-neutral-100 h-10 dark:bg-neutral-800 rounded-full overflow-hidden border   border-neutral-200 dark:border-neutral-700'}>
                <button
                  onClick={handleLike}
                  className={`h-full flex  justify-center text-center p-2  items-center px-3  gap-2  hover:bg-neutral-200 dark:hover:bg-neutral-700 transition`}
                >
                  <FontAwesomeIcon icon={liked ? faThumbsUpSolid : faThumbsUpRegular} className={`text-xl ${animateLike ? 'animate-thumbs-up ' : ''}`} />
                  {likeCount > 0 && <h3 className="font-bold h-full flex justify-center items-center">{formatNumber(likeCount)}</h3>}
                </button>
                <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700" />
                <button onClick={handleDislike} className=" h-full flex items-center px-3  hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
                  <FontAwesomeIcon icon={dislike ? faThumbsDownSolid : faThumbsDownRegular} className="-scale-x-100 text-xl" />
                  {dislikeCount > 0 && <h3 className="font-bold">{formatNumber(dislikeCount)}</h3>}
                </button>
              </div>
              <button
                onClick={handleOpenShareModal}
                className="px-4 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                <FontAwesomeIcon icon={faShare} />
                <span>Share</span>
              </button>
            </div>
          </div>
          {/*description container*/}
          <div className={`relative ${expandVideoDescription ? 'h-fit' : 'h-16'} flex w-full flex-col p-4  overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-lg `}>
            {/* text container */}
            <div className="h-full flex-wrap text-wrap space-y-4 ">
              <h2>{decodeHtmlEntities(selectedVideo?.snippet.channelDescription)}</h2>
              <p>{decodeHtmlEntities(selectedVideo?.snippet?.description)}</p>
            </div>
            {/*fading overlay*/}
            {!expandVideoDescription && (
              <div className="absolute inset-x-0  bottom-0   rounded-b-lg  h-12  bg-gradient-to-t from-white dark:from-darkTheme via-[rgba(255,255,255,0.5)] to-transparent pointer-events-none " />
            )}
            <button
              className="absolute right-0 bottom-0  font-thin hover:text-neutral-500  dark:text-neutral-300 dark:hover:text-neutral-400 z-10"
              onClick={handleExpandVideoDescription}
            >
              {expandVideoDescription ? 'show less' : '...more'}
            </button>
          </div>
          {/*Comments && statistics*/}
          <div className="flex flex-row space-x-4 text-xl font-bold">
            <h1>{formatNumber(selectedVideo?.statistics?.commentCount)}</h1>
            <h1>Comments</h1>
          </div>
        </section>
      )}
    </div>
  );
}
