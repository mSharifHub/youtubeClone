import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import LocalCache from '../../apiCache/LocalCache.ts';
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
}

export interface VideoStatistics {
  viewCount: string;
  likeCount?: string;
  dislikeCount?: string;
  commentCount?: string;
  duration?: string;
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
  videos: Video[];
  loading: boolean | null;
  error: string | null;
  selectedVideoId: string | null;
  handleSelectedVideo: (video:Video) => void;
  loadMoreVideos: () => void;
}



export default function useYoutubeVideos(
  apiKey: string,
  maxResult: number,
  section: string,
  isInfiniteScroll: boolean = false,
): UseYoutubeVideosResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);



  const{setCurrentVideo } = useSelectedVideo()

  const navigate = useNavigate();

  const cachedVideos = LocalCache.getInstance();
  const cacheVideosKey = `youtube_videos_${section}`;
  const cacheNextPageTokenKey = `next_page_${section}`;




  /**
   * A callback function to handle selection of a video. It sets the currently selected video
   * and navigates to the corresponding video watch page.

   * @function
   * @param {Video} video - The video object representing the selected video, which includes its `id` and `videoId`.
   *@setCurrentVideo - Use context to set the selected video and retrirve the data to use on the play video page
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

  /*
    to fetch video statistics
   */
  const fetchVideoStatistics = async (videoIds: string[]) => {
    try {
      const idsString = videoIds.join(',');

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${idsString}&part=statistics,contentDetails`,
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
        };
        return map;
      }, {});
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to fetch video statistics.');
    }
  };

  // /*
  //  *Fetch additional video details
  //  */
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

      return response.data.items.reduce((map: Record<string, { channelId: string; channelTitle?: string; logo?: string, subscriberCount?:string, channelDescription?:string }>, item) => {
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


  /*
  To debug re-renders and fetchFirst needed while strict mode is being used
  */
  const fetchFirst = useRef(true);
  /**
   @param{string} [pageToken]- (Optional) Token for the infinite scroll
    *
    *Behavior:
    * - If loading is True prevents in calling a duplicate fetch
   **/
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

        if (isInfiniteScroll && response.data.nextPageToken.length > 0) {
          const newPageToken = response.data.nextPageToken;
          setNextPageToken(newPageToken);
          cachedVideos.set<string>(cacheNextPageTokenKey, newPageToken);
        }

        const videoItems: Video[] = response.data.items;
        const videoIds: string[] = videoItems.map((video: Video) => video.id.videoId);

        const channelIds: string[] = [...new Set(videoItems.map((video: Video) => video.snippet.channelId))];

        const statisticsMap = await fetchVideoStatistics(videoIds);

        const channelMap = await fetchChannelDetails(channelIds);

        const newVideos = videoItems.map((video: Video) => ({
          ...video,
          statistics:{
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
            subscriberCount:channelMap[video.snippet.channelId]?.subscriberCount,
            channelDescription:channelMap[video.snippet.channelId]?.channelDescription,
            description:video.snippet.description,
          },
        }));


          setVideos(
            (prevVideos) => {
              const uniqueVideos = newVideos.filter(
              (newVideo)=> !prevVideos.some((existing)=>existing.id.videoId === newVideo.id.videoId))

            return nextPageToken ? [...prevVideos, ...uniqueVideos] : [...uniqueVideos];
          })


          const cachedUniqueVideos = cachedVideos.get<Video[]>(cacheVideosKey) || []

           const uniqueCachedVideos = [
             ...cachedUniqueVideos,
             // eslint-disable-next-line max-len
             ...newVideos.filter((newVideo)=> !cachedUniqueVideos.some((cachedVideos) => cachedVideos.id.videoId === newVideo.id.videoId))
           ]

         cachedVideos.set<Video[]>(cacheVideosKey, uniqueCachedVideos)
        }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = useCallback(() => {
    if (loading || videos.length >=80) return;

    const token = nextPageToken ? nextPageToken : cachedVideos.get<string>(cacheNextPageTokenKey);
    if (!token) return;
    fetchVideos(token);
  }, [loading, videos.length, nextPageToken]);

  /*
   * Behavior:
   * - Is called once in the application for all video sections in home page. If  theres
   * cached videos set the videos state to the data in cache
   * else make one fetch request
   */
  useEffect(() => {
    if (fetchFirst.current) {
      fetchFirst.current = false;
      const cached = cachedVideos.get<Video[]>(cacheVideosKey);
      if (cached && cached.length > 0) {
        setVideos(cached);
      } else {
        fetchVideos();
      }
    }
  }, []);

  useEffect(() => {
    if (nextPageToken) {
      cachedVideos.set<string>(cacheNextPageTokenKey, nextPageToken);
    }
  }, [nextPageToken]);

  return {
    videos,
    loading,
    error,
    loadMoreVideos,
    handleSelectedVideo,
  };
}
