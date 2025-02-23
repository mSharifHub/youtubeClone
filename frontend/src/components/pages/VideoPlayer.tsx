import { useParams } from 'react-router-dom';
import React, { useRef } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';

export const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();

  const playerRef = useRef<YouTubePlayer | null>(null);

  const opts: YouTubeProps['opts'] = {
    playerVars: {
      autoplay: 0,
      controls: 1,
      fs: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  const YoutubeComponent = YouTube as YouTubeProps as React.FC<YouTubeProps>;

  return (
    <div className="h-full  flex flex-row space-x-10 overflow-y-scroll scroll-smooth p-4 no-scrollbar ">
      <div className="h-full w-full flex-grow flex flex-col justify-start items-center ">
        <div className=" relative  w-full  min-h-[200px] max-h-[70%] aspect-video  ">
          <YoutubeComponent
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            iframeClassName="absolute inset-0 h-full  w-full rounded-xl"
          />
        </div>

        <div className=" flex flex-grow w-full border">video info</div>
      </div>
      <div className="hidden h-full lg:flex flex-col justify-start items-center  w-[600px] flex-shrink border border-amber-400">
        related video column
      </div>
    </div>
  );
};
