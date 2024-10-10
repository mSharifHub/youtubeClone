import { Video as VideoType } from './hooks/useYoutubeVideos.ts';

interface VideoProps extends VideoType {
  selectedVideoId: string | null;
  handleVideoClick: (videoId: string) => void;
}

export default function YoutubeVideos({
  id,
  snippet,
  selectedVideoId,
  handleVideoClick,
}: VideoProps) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center ">
      {/*{selectedVideoId === id.videoId ? (*/}
      {/*  <iframe*/}
      {/*    width="560"*/}
      {/*    height="315"*/}
      {/*    src={`https://www.youtube.com/embed/${id.videoId}`}*/}
      {/*    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"*/}
      {/*    allowFullScreen*/}
      {/*    title="YouTube Video Player"*/}
      {/*  ></iframe>*/}
      {/*) : (*/}
      <img
        src={snippet.thumbnails?.default?.url}
        alt={snippet.title}
        onClick={() => handleVideoClick(id.videoId)}
        className="invert pointer"
      />
      {/*)}*/}
      <div className="font-bold text-lg  text-center">{snippet.title}</div>
    </div>
  );
}
