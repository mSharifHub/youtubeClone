import { VideoCardLoading } from './VideoCardLoading.tsx';
import { VideoCard } from './VideoCard.tsx';
import React from 'react';
import { VideoNode } from '../../graphql/types.ts';

interface RelatedVideosProps {
  relatedVideos: VideoNode[] | [];
  relatedVideosLoading: boolean;
  handleSelectedVideo: (video: VideoNode) => void;
}

export const RelatedVideos: React.FC<RelatedVideosProps> = ({ relatedVideos, relatedVideosLoading, handleSelectedVideo }) => {
  return (
    <>
      {relatedVideosLoading ? (
        <div className="w-full space-y-10">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <VideoCardLoading key={`loading-${index}`} />
          ))}
        </div>
      ) : (
        relatedVideos.map((video) => (
          <div key={`${video.videoId}`} onClick={() => handleSelectedVideo(video)}>
            <VideoCard video={video} />
          </div>
        ))
      )}
    </>
  );
};
