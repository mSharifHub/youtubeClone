import { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { saveToDB } from '../../utils/videoCacheDb/videoCacheDB.ts';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';

export interface VideoSnippet {
  title?: string;
  description: string;
  thumbnails?: {
    default?: {
      url: string;
    };
    medium?: {
      url: string;
    };
    high?: {
      url: string;
    };
  };
  channelId: string;
  channelTitle: string;
  channelDescription: string;
  channelLogo?: string;
  publishedAt: string;
  subscriberCount?:string
  categoryId: string;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount?: string;
  dislikeCount?: string;
  commentCount: string;
  duration?: string;
  categoryId?: string;
}

export interface VideoId {
  videoId: string;
}

export interface VideoContentDetails {
  duration: string;
}

export interface Video {
  id: VideoId;
  snippet: VideoSnippet;
  statistics?: VideoStatistics;
  contentDetails?: VideoContentDetails;
}

interface UseYoutubeVideosResult {
  videosLoading: boolean;
  videosError: string | null;
  handleSelectedVideo: (video:Video) => void;
  fetchVideos: (nextPageToken?: string) => Promise<void>;
  videos: Video[] | []
  setVideos: (videos: Video[] | []) => void;
  relatedVideos: Video[] | [];
  relatedVideosLoading: boolean;
  relatedVideosError: string | null;
  fetchRelatedVideos: (categoryId: string, pageToken?: string) => Promise<void>;
  fetchVideoById:(videoId:string) => Promise<Video| undefined>;
  videosNextPageToken: string | null
}


export default function useYoutubeVideos(
  apiKey: string,
  maxResult: number,
): UseYoutubeVideosResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [videosNextPageToken, setVideosNextPageToken] = useState<string | null>(null);

  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [relatedVideosLoading, setRelatedVideosLoading] = useState<boolean>(false);
  const [relatedVideosError, setRelatedVideosError] = useState<string | null>(null);

  const {setSelectedVideo} = useSelectedVideo()


  const navigate = useNavigate();

  const fetchVideoStatistics = async (videoIds: string[]) => {
    try {
      const idsString = videoIds.join(',');

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${idsString}&part=snippet,statistics,contentDetails`,
      );

      if (!response.data.items || response.data.items.length === 0) {
        console.warn('No video statistics found for the given video ids');
        return {};
      }

      return response.data.items.reduce((map: Record<string, VideoStatistics>, item) => {
        map[item.id] = {
          viewCount: item.statistics?.viewCount || '0',
          likeCount: item.statistics?.likeCount || '0',
          dislikeCount: item.statistics?.dislikeCount || '0',
          commentCount: item.statistics?.commentCount || '0',
          duration: item.contentDetails?.duration || 'PT0S',
          categoryId: item.snippet?.categoryId || '',
        };
        return map;
      }, {});
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to fetch video statistics.');
    }
  };

  const fetchChannelDetails = async (channelIds: string[]) => {
    try {
      const idsString = channelIds.join(',');
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${idsString}&part=snippet,statistics`,
      );

      if (!response.data.items || response.data.items.length === 0) {
        console.warn('No video details found for the given video ids');
        return {};
      }

      return response.data.items.reduce(
        (map: Record<string, {
           channelId: string;
           channelTitle?: string;
           logo?: string,
           subscriberCount?:string,
           channelDescription?:string,
          }>
         , item
        ) => {
        map[item.id] = {
          channelId: item.id || '',
          channelTitle: item.snippet?.title || '',
          logo: item.snippet.thumbnails?.default?.url || '',
          subscriberCount:item.statistics?.subscriberCount || '0',
          channelDescription: item.snippet?.description ||'',
        };
        return map;
      }, {});
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to fetch video Details.');
    }
  };

  const fetchRelatedVideos = async (categoryId: string, pageToken?: string ) =>{

    if (relatedVideosLoading) return

    setRelatedVideosLoading(true);
    setVideosError(null);

    try{

      let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&maxResults=${maxResult}&type=video&videoCategoryId=${categoryId}`
      if (pageToken) url += `&pageToken=${pageToken}`;

      const response = await axios.get(url)

      if (response.status === 200) {
        if (!response.data.items || response.data.items.length === 0) {
          return
        }

        if (response.data.nextPageToken) {
          const newPageToken = response.data.nextPageToken;
          setVideosNextPageToken(newPageToken);
        }

        const videoItems: Video[] = response.data.items;
        const videoIds : string[] = videoItems.map((video:Video)=>video.id.videoId)
        const channelIds: string[] = [...new Set(videoItems.map((video:Video)=>video.snippet.channelId))]
        const statisticsMap = await fetchVideoStatistics(videoIds);
        const channelMap = await fetchChannelDetails(channelIds);

        const videos = videoItems.map((video: Video) => ({
          ...video,
          statistics: {
            viewCount: statisticsMap[video.id.videoId]?.viewCount,
            likeCount: statisticsMap[video.id.videoId]?.likeCount,
            dislikeCount: statisticsMap[video.id.videoId]?.dislikeCount,
            commentCount: statisticsMap[video.id.videoId]?.commentCount,
            duration: statisticsMap[video.id.videoId]?.duration,
          },
          snippet: {
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnails: video.snippet.thumbnails,
            channelId: video.snippet.channelId,
            channelTitle: channelMap[video.snippet.channelId]?.channelTitle,
            channelLogo: channelMap[video.snippet.channelId]?.logo,
            publishedAt: video.snippet.publishedAt,
            subscriberCount: channelMap[video.snippet.channelId]?.subscriberCount,
            channelDescription: channelMap[video.snippet.channelId]?.channelDescription,
            categoryId: statisticsMap[video.id.videoId]?.categoryId || '',

          },
        }))
        setRelatedVideos(videos)
      }
    }
    catch(err){
      setRelatedVideosError( err instanceof Error ? err.message : 'Failed to fetch related videos details.');
    }
    finally {
      setRelatedVideosLoading(false);
    }

  }

  const fetchVideos = async (pageToken?: string) => {
    if (videosLoading) {
      return;
    }

    if (videos.length >= 50) return;

    setVideosLoading(true);
    setVideosError(null);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        if (!response.data.items || response.data.items.length === 0) {
          return;
        }

        if (response.data.nextPageToken.length > 0) {
          const newPageToken = response.data.nextPageToken;
          setVideosNextPageToken(newPageToken);
        }

        const videoItems: Video[] = response.data.items;
        const videoIds: string[] = videoItems.map((video: Video) => video.id.videoId);

        const channelIds: string[] = [...new Set(videoItems.map((video: Video) => video.snippet.channelId))];

        const statisticsMap = await fetchVideoStatistics(videoIds);

        const channelMap = await fetchChannelDetails(channelIds);

        const videos = videoItems.map((video: Video) => ({
          ...video,
          statistics: {
            ...video.statistics,
            viewCount: statisticsMap[video.id.videoId]?.viewCount,
            likeCount: statisticsMap[video.id.videoId]?.likeCount,
            dislikeCount: statisticsMap[video.id.videoId]?.dislikeCount,
            commentCount: statisticsMap[video.id.videoId]?.commentCount,
            duration: statisticsMap[video.id.videoId]?.duration,
          },
          snippet: {
            ...video.snippet,
            title: video.snippet.title,
            channelTitle: channelMap[video.snippet.channelId]?.channelTitle,
            channelLogo: channelMap[video.snippet.channelId]?.logo,
            publishedAt: video.snippet.publishedAt,
            subscriberCount: channelMap[video.snippet.channelId]?.subscriberCount,
            channelDescription: channelMap[video.snippet.channelId]?.channelDescription,
            description: video.snippet.description,
            categoryId: statisticsMap[video.id.videoId]?.categoryId || '',
          },
        }))

        setVideos( (previous)=>{
          const newVideos = videos.filter(video=> !previous.some(v=>v.id.videoId === video.id.videoId ))
          if ( newVideos.length === 0) return previous
          const updated = [...previous, ...newVideos]
          saveToDB('infiniteScroll', updated);
          return updated;
        })
      }

    } catch (err) {
      setVideosError(err instanceof Error ? err.message : 'An error occurred');
    } finally {

      setVideosLoading(false);
    }
  };

  const fetchVideoById = async (videoId: string) => {

    if (videosLoading) {
      return;
    }

    setVideosLoading(true);
    setVideosError(null);

    try{

      const url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId}&part=snippet,statistics,contentDetails`

      const response = await axios.get(url)

      if (response.status === 200) {
        const videoData  = response.data.items[0]
        const channelId = videoData.snippet.channelId

        const channelRes = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=snippet,statistics`
        );

        const channelData = channelRes.data.items[0]

        return {
          id: {
            videoId: videoData.id,
          },
          snippet: {
            title: videoData.snippet.title,
            description: videoData.snippet.description,
            thumbnails: videoData.snippet.thumbnails,
            channelId,
            channelTitle: channelData?.snippet?.title || '',
            channelLogo: channelData?.snippet?.thumbnails?.default?.url || '',
            publishedAt: videoData.snippet.publishedAt,
            subscriberCount: channelData?.statistics?.subscriberCount || '0',
            channelDescription: channelData?.snippet?.description || '',
            categoryId: videoData.snippet?.categoryId || '',
          },
          statistics: {
            viewCount: videoData.statistics?.viewCount || '0',
            likeCount: videoData.statistics?.likeCount || '0',
            dislikeCount: videoData.statistics?.dislikeCount || '0',
            commentCount: videoData.statistics?.commentCount || '0',
            duration: videoData.contentDetails?.duration || 'PT0S',

          },
        };

      }

    }catch(err){
      setVideosError(err instanceof Error ? err.message : 'An error occurred fetching video by id');
    }
  }

  const handleSelectedVideo =async (video:Video)=> {
    const videoId = video.id.videoId;
    if (!videoId) return
    try{
      setSelectedVideo(video);
    }
    catch(err){
      throw new Error(err instanceof Error ? err.message : 'An error occurred setting selected video');
    }
    finally {
      navigate(`/watch/${videoId}`);
    }
  }


  return {
    videosLoading,
    videosError,
    fetchVideos,
    videos,
    setVideos,
    fetchRelatedVideos,
    relatedVideos,
    relatedVideosLoading,
    relatedVideosError,
    fetchVideoById,
    videosNextPageToken,
    handleSelectedVideo,
  };

}
