import React from 'react';
import { VideoCard } from '../VideoComponents/VideoCard.tsx';
import { VideoNode } from '../../graphql/types.ts';

interface PlayListContainerProps {
  viewAll: boolean;
  videosPerRow: number;
  playListLength: number;
  playlist: VideoNode[];
  HandleSelectedVideo: (video: VideoNode) => void;
}

export const PlayListContainer = React.forwardRef<HTMLDivElement, PlayListContainerProps>(({ viewAll, videosPerRow, playListLength, playlist, HandleSelectedVideo }, ref) => {
  return (
    <div
      ref={ref}
      className={` ${viewAll ? 'grid grid-flow-row  gap-y-8' : 'flex  overflow-x-scroll scroll-smooth no-scrollbar'}  overflow-hidden   `}
      style={{
        ...(viewAll && { gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))` }),
      }}
    >
      {playListLength > 0 &&
        playlist.map((video) => (
          <div
            key={`${video.videoId}`}
            className="flex flex-col w-full cursor-pointer overflow-hidden flex-shrink-0 px-2"
            style={{
              ...(!viewAll && { width: `${100 / videosPerRow}%` }),
            }}
            onClick={() => HandleSelectedVideo(video)}
          >
            <VideoCard video={video} />
          </div>
        ))}
    </div>
  );
});

PlayListContainer.displayName = 'PlayListContainer';
