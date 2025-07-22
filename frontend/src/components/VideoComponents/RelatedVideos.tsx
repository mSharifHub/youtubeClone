import { VideoCardLoading } from './VideoCardLoading.tsx';
import { VideoCard } from './VideoCard.tsx';
import React from 'react';
import { Video } from '../../types/youtubeVideoInterfaces.ts';

interface RelatedVideosProps {
  relatedVideos: Video[] | [];
  relatedVideosLoading: boolean;
  relatedVideosError: string | null;
  handleSelectedVideo: (video: Video) => void;
}

export const RelatedVideos: React.FC<RelatedVideosProps> = ({ relatedVideos, relatedVideosLoading, handleSelectedVideo, relatedVideosError }) => {
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
          <div key={`${video.id.videoId}-${video.snippet.title}`} onClick={() => handleSelectedVideo(video)}>
            <VideoCard video={video} />
          </div>
        ))
      )}
    </>
  );
};
