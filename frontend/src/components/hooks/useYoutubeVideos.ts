import { useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  channelDescription?: string;
  channelLogo?: string;
  publishedAt: string;
  subscriberCount?:string
  categoryId?: string;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount?: string;
  dislikeCount?: string;
  commentCount?: string;
  duration?: string;
  categoryId?:string
}

export interface VideoId {
  videoId: string;
}

export interface Video {
  id: VideoId;
  snippet: VideoSnippet;
  statistics?: VideoStatistics;
}

interface UseYoutubeVideosResult {
  loading: boolean | null;
  error: string | null;
  handleSelectedVideo: (video:Video) => void;
  fetchVideos: (nextPageToken?: string) => Promise<Video[] | undefined>;
  relatedVideos:(categoryId:string, nextPageToken?:string) => Promise<Video[] | undefined>;
  nextPageToken: string | null
}


export default function useYoutubeVideos(
  apiKey: string,
  maxResult: number,
): UseYoutubeVideosResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const{setCurrentVideo } = useSelectedVideo()

  const navigate = useNavigate();

  /**
   * A callback function to handle selection of a video. It sets the currently selected video
   * and navigates to the corresponding video watch page.
   *@function
   *@param {Video} video - The video object representing the selected video, which includes its `id` and `videoId`.
   *@setCurrentVideo - Use context to set the selected video and retrieve the data to use on the play video page
   */
  const handleSelectedVideo = useCallback((video:Video)=> {
    const {
      id: { videoId }} = video

    if (!videoId) return

    try{
      setCurrentVideo(video)
    }
    catch (err){
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
    finally {
      navigate(`/watch/${videoId}`);
    }
  },[navigate, setCurrentVideo])


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
          categoryId: item.snippet?.categoryId || ''
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

  const relatedVideos = async (categoryId: string, pageToken?: string ) =>{

    if (loading) return

    setLoading(true);
    setError(null);

    try{
      let url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet,statistics,contentDetails&categoryId=${categoryId}&maxResult=${maxResult}`;

      if (pageToken) url += `&pageToken=${pageToken}`;

      const response = await axios.get(url)

      if (response.status === 200) {
        if (!response.data.items || response.data.items.length === 0) {
          return
        }

        if (response.data.nextPageToken) {
          const newPageToken = response.data.nextPageToken;
          setNextPageToken(newPageToken);
        }

        const videoItems: Video[] = response.data.items;
        const videoIds : string[] = videoItems.map((video:Video)=>video.id.videoId)
        const channelIds: string[] = [...new Set(videoItems.map((video:Video)=>video.snippet.channelId))]
        const statisticsMap = await fetchVideoStatistics(videoIds);
        const channelMap = await fetchChannelDetails(channelIds);

        return videoItems.map((video: Video) => ({
          ...video,
          // id: { videoId: video.id  },
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
            categoryId: statisticsMap[video.id.videoId]?.categoryId,
          },
        }))
      }

    }
    catch(err){

      setError( err instanceof Error ? err.message : 'Failed to fetch related videos details.');
    }
    finally {
      setLoading(false);
    }

  }

  const fetchVideos = async (pageToken?: string) => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        if (!response.data.items || response.data.items.length === 0) {
          return;
        }

        if (response.data.nextPageToken.length > 0) {
          const newPageToken = response.data.nextPageToken;
          setNextPageToken(newPageToken);
        }

        const videoItems: Video[] = response.data.items;
        const videoIds: string[] = videoItems.map((video: Video) => video.id.videoId);

        const channelIds: string[] = [...new Set(videoItems.map((video: Video) => video.snippet.channelId))];

        const statisticsMap = await fetchVideoStatistics(videoIds);

        const channelMap = await fetchChannelDetails(channelIds);

        return videoItems.map((video: Video) => ({
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
            categoryId: statisticsMap[video.id.videoId]?.categoryId,
          },
        }))
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchVideos,
    relatedVideos,
    nextPageToken,
    handleSelectedVideo,
  };

}
