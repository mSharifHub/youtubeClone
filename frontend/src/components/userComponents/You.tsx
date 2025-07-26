import { UserProfileCard } from './UserProfileCard.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../../helpers/homeVideoDisplayOptions.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { sliceText } from '../../helpers/sliceText.ts';
import timeSince from '../../helpers/timeSince.ts';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';
import { formatNumber } from '../../helpers/formatNumber.ts';
import { mapVideoNodeToVideo } from '../../helpers/mapVideoNodeToVideo.ts';
import { useViewerVideoPlayListQuery, VideoPlaylistEntryNode } from '../../graphql/types.ts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.ts';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';

export const You = () => {
  const { data, loading, fetchMore } = useViewerVideoPlayListQuery({
    variables: { first: 10 },
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
  const videosPerRow = useVideoGrid(videosPerRowDisplayValues);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewAll, setViewAll] = useState<boolean>(false);
  const playlist = (data?.viewerVideoPlaylist?.videoEntries?.edges ?? []).filter((edge): edge is { node: VideoPlaylistEntryNode } => !!edge?.node && !!edge.node.video);

  const HandleSelectedVideo = useHandleSelectedVideo();

  const handleLoadMore = async () => {
    if (loading) return;

    if (!data?.viewerVideoPlaylist?.videoEntries?.pageInfo || !data?.viewerVideoPlaylist?.videoEntries.pageInfo.endCursor) return;

    await fetchMore({
      variables: {
        first: 10,
        after: data?.viewerVideoPlaylist?.videoEntries?.pageInfo?.endCursor,
      },
    });
  };

  const sentinelRef = useIntersectionObserver(handleLoadMore, loading, playlist.length);

  const getScrollAmount = useCallback(() => {
    const containerWidth = scrollRef.current?.clientWidth ?? 0;
    return containerWidth / videosPerRow;
  }, [videosPerRow]);

  const scrollToPosition = useCallback(
    (index: number, smooth: boolean = true) => {
      if (!scrollRef.current) return;
      const scrollAmount = getScrollAmount();
      const targetScrollLeft = index * scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: smooth ? 'smooth' : 'instant',
      });
    },

    [getScrollAmount],
  );

  const handleScrollUp = () => {
    if (!scrollRef.current) return;
    const maxIndex = Math.max(0, playlist.length - videosPerRow);
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    setCurrentIndex(newIndex);
    scrollToPosition(newIndex);
  };

  const handleScrollDown = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    scrollToPosition(newIndex);
  };

  const handleViewAll = () => {
    setViewAll((prev) => !prev);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-y-scroll scroll-smooth  p-8 gap-8  ">
      <UserProfileCard />
      <div className="w-full flex flex-col gap-2 p-2 ">
        <h1 className="text-2xl font-medium ">History</h1>
        <div className=" flex flex-row justify-end  gap-4 items-center px-3 mb-4">
          <div
            onClick={handleViewAll}
            className="border-[1px] flex items-center justify-center   rounded-full h-12 w-28 capitalize cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100"
          >
            view all
          </div>
          <button
            disabled={viewAll || currentIndex === 0}
            onClick={handleScrollDown}
            className={` border-[1px] rounded-full  min-h-10 min-w-10 h-10 w-10  flex justify-center items-center cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100' ${viewAll && 'opacity-50 cursor-not-allowed'}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            disabled={viewAll}
            onClick={handleScrollUp}
            className={` border-[1px] rounded-full  min-h-10 min-w-10 h-10 w-10  flex justify-center items-center cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100 ${viewAll && 'opacity-50 cursor-not-allowed'} `}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className={` ${viewAll ? 'grid grid-flow-row  gap-y-8' : 'flex  overflow-x-scroll scroll-smooth no-scrollbar'}  overflow-hidden   `}
          style={{
            ...(viewAll && { gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))` }),
          }}
        >
          {playlist.length > 0 &&
            playlist.map(({ node }) => (
              <div
                key={`${node.id}-${node.video.videoId}`}
                className="flex flex-col w-full cursor-pointer overflow-hidden flex-shrink-0 px-2"
                style={{
                  ...(!viewAll && { width: `${100 / videosPerRow}%` }),
                }}
                onClick={() => HandleSelectedVideo(mapVideoNodeToVideo(node.video))}
              >
                <div className="aspect-video">
                  <img alt="" src={node.video.thumbnailMedium ?? node.video.thumbnailDefault ?? ''} className="h-full w-full object-cover rounded-lg" />
                </div>
                <div>{sliceText({ s: node.video.title })}</div>
                <div>{formatNumber(node.video.viewCount as number)} views</div>
                <div>viewed {timeSince(node.watchedAt)}</div>
              </div>
            ))}
        </div>
        {loading && <SpinningCircle />}
        {viewAll && <div ref={sentinelRef} />}
      </div>
    </div>
  );
};
