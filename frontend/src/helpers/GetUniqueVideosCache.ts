import { VideoNode, YoutubeVideoResponse } from '../graphql/types.ts';

type VideoOrRef = VideoNode | { __ref: string };

export const GetUniqueVideosCache = (existing: YoutubeVideoResponse | undefined, incoming: YoutubeVideoResponse) => {
  const getVideosIds = (video: VideoOrRef): string => {
    if ('__ref' in video && video.__ref) {
      return video.__ref.split(':')[1] || video.__ref;
    }
    return (video as VideoNode).videoId;
  };

  const existingVideoIds = new Set((existing?.videos || []).map((video) => video && getVideosIds(video as VideoOrRef)).filter(Boolean));

  return (incoming.videos ?? []).filter((video): video is VideoNode => {
    if (video === null) return false;
    const videoId = getVideosIds(video);
    return !existingVideoIds.has(videoId);
  });
};
