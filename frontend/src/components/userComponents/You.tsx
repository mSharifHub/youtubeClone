import { UserProfileCard } from './UserProfileCard.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useViewerVideoPlayListQuery, VideoPlaylistEntryNode } from '../../graphql/types.ts';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../../helpers/homeVideoDisplayOptions.ts';
import { useCallback, useRef, useState } from 'react';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { sliceText } from '../../helpers/sliceText.ts';
import timeSince from '../../helpers/timeSince.ts';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';
import { formatNumber } from '../../helpers/formatNumber.ts';
import { mapVideoNodeToVideo } from '../../helpers/mapVideoNodeToVideo.ts';

export const You = () => {
  const { data, loading, error } = useViewerVideoPlayListQuery();
  const videosPerRow = useVideoGrid(videosPerRowDisplayValues);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const playlist = (data?.viewerVideoPlaylist?.videoEntries?.edges ?? []).filter((edge): edge is { node: VideoPlaylistEntryNode } => !!edge?.node && !!edge.node.video);

  const HandleSelectedVideo = useHandleSelectedVideo();

  const getScrollAmount = useCallback(() => {
    const containerWidth = scrollRef.current?.clientWidth ?? 0;
    return containerWidth / videosPerRow;
  }, [videosPerRow]);

  const handleScrollUp = () => {
    if (!scrollRef.current) return;

    const maxIndex = playlist.length;

    if (currentIndex > maxIndex) return;

    const newIndex = Math.min(currentIndex + 1, maxIndex);

    setCurrentIndex(newIndex);

    const scrollAmount = getScrollAmount();

    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="h-full w-full flex flex-col overflow-y-scroll scroll-smooth  p-8 gap-8  border ">
      <UserProfileCard />
      <div className="w-full flex flex-col gap-2 p-2 ">
        <h1 className="text-2xl font-medium ">History</h1>
        <div className=" flex flex-row justify-end  gap-4 items-center px-3 mb-4">
          <div className="border-[1px]  rounded-full px-8 py-2 capitalize cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100">view all</div>
          <div
            // onClick={handleScrollDown}
            className=" border-[1px] rounded-full  min-h-10 min-w-10 h-10 w-10  flex justify-center items-center cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div
            onClick={handleScrollUp}
            className={` border-[1px] rounded-full  min-h-10 min-w-10 h-10 w-10  flex justify-center items-center cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100 `}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
        {loading && <SpinningCircle />}
        <div
          ref={scrollRef}
          className=" flex overflow-hidden overflow-x-scroll scroll-smooth no-scrollbar"
          style={{
            pointerEvents: 'none',
          }}
        >
          {playlist.length > 0 &&
            !loading &&
            !error &&
            playlist.map(({ node }) => (
              <div
                key={`${node.id}-${node.video.videoId}`}
                className="flex flex-col w-full cursor-pointer overflow-hidden flex-shrink-0 px-2"
                style={{ width: `${100 / videosPerRow}%` }}
                onClick={() => HandleSelectedVideo(mapVideoNodeToVideo(node.video))}
              >
                <div className="aspect-video">
                  <img alt="" src={node.video.thumbnailMedium ?? node.video.thumbnailDefault ?? ''} className=" h-full w-full object-cover rounded-lg " />
                </div>
                <div> {sliceText({ s: node.video.title })}</div>
                <div>{formatNumber(node.video.viewCount as number)} views </div>
                <div>viewed {timeSince(node.watchedAt)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
