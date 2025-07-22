import { UserProfileCard } from './UserProfileCard.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useViewerVideoPlayListQuery, VideoPlaylistEntryNode } from '../../graphql/types.ts';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../../helpers/homeVideoDisplayOptions.ts';
import { useState } from 'react';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { sliceText } from '../../helpers/sliceText.ts';

export const You = () => {
  const { data, loading, error } = useViewerVideoPlayListQuery();
  const videosPerRow = useVideoGrid(videosPerRowDisplayValues);
  const [startIndex, setStartIndex] = useState<number>(0);

  const playlist = (data?.viewerVideoPlaylist?.videoEntries?.edges ?? []).filter((edge): edge is { node: VideoPlaylistEntryNode } => !!edge?.node && !!edge.node.video);

  const handleScrollUp = () => {
    if (startIndex + videosPerRow >= playlist.length) return;

    setStartIndex(startIndex + videosPerRow);
  };

  const handleScrollDown = () => {
    if (startIndex - videosPerRow < 0) return;
    setStartIndex(startIndex - videosPerRow);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-y-scroll scroll-smooth  p-8 gap-8 ">
      <UserProfileCard />
      <div className="w-full flex flex-col gap-2 p-2 ">
        <h1 className="text-2xl font-medium ">History</h1>
        <div className=" flex flex-row justify-end  gap-4 items-center px-3 mb-4">
          <div className="border-[1px]  rounded-full px-8 py-2 capitalize cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100">view all</div>
          <div
            onClick={handleScrollDown}
            className=" border-[1px] rounded-full  min-h-10 min-w-10 h-10 w-10  flex justify-center items-center cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div
            onClick={handleScrollUp}
            className=" border-[1px] rounded-full  min-h-10 min-w-10 h-10 w-10  flex justify-center items-center cursor-pointer hover:dark:bg-neutral-700 hover:bg-neutral-100"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
        {loading && <SpinningCircle />}
        <div className="grid grid-flow-col  gap-4 " style={{ gridTemplateColumns: `repeat(${videosPerRow}, 1fr) ` }}>
          {playlist.length > 0 &&
            !loading &&
            !error &&
            playlist.slice(startIndex, startIndex + videosPerRow).map(({ node }) => (
              <div key={`${node.id}-${node.video.videoId}`} className="flex flex-col w-full  gap-4 rounded  cursor-pointer overflow-hidden">
                <div className="aspect-video">
                  <img alt="" src={node.video.thumbnailMedium ?? node.video.thumbnailDefault} className=" h-full w-full object-cover " />
                </div>
                <div> {sliceText({ s: node.video.title })}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
