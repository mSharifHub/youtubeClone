import { VideoId } from '../types/youtubeVideoInterfaces.ts';

export function getVideoId(id: VideoId): string {
  return typeof id === 'string' ? id : id.videoId;
}
