import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { Video } from '../helpers/youtubeVideoInterfaces.ts';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { loadFromDB, saveToDB } from '../../utils/videoCacheDb/videoCacheDB.ts';
import { fetchVideoStatistics } from '../helpers/fetchVideoStatistics.ts';
import { fetchChannelDetails } from '../helpers/fetchChannelDetails.ts';
import axios from 'axios';

interface UseYoutubeVideoOptions {
  videosLoading: boolean;
  videosError: string | null;
  handleSelectedVideo: (video:Video) => void;
  videos: Video[]
  videosNextPageToken: string | null;
  fetchVideos: (options: { pageToken?: string; query?: string }) =>  Promise<void>;
}

export default function useYoutubeVideos(
  apiKey: string,
  maxResult?: number,

): UseYoutubeVideoOptions {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [videosNextPageToken, setVideosNextPageToken] = useState<string | null>(null);

  const {setSelectedVideo} = useSelectedVideo()
  const navigate = useNavigate();
  const { state: { isLoggedIn } } = useUser();


  const fetchVideos = useCallback(async ({pageToken, query="trending"}:{pageToken?:string, query?:string}) => {

    if (videosLoading) return;

    setVideosLoading(true);
    setVideosError(null);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&q=${query}${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}&regionCode=US`;

      const response = await axios.get(url);

      if (!response.data.items || response.data.items.length === 0) {
        setVideosError(response.statusText);
        setVideos([])
        setVideosNextPageToken(null)
        setVideosLoading(false)
        return
      }

      setVideosNextPageToken(response.data.nextPageToken?? null);

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

      setVideos ((previous)=>{
        const existingIds = new Set(previous.map(v=>v.id.videoId))
        const newVideos = videos.filter(video=> !existingIds.has(video.id.videoId))
        if ( newVideos.length === 0) return previous
        const updatedList = [...previous,...newVideos]
        const updated = [...updatedList]
        saveToDB("homeVideosScroll",{
          videos: updated,
          nextPageToken:response.data.nextPageToken ?? null,
        })
        return updatedList
      })


    } catch (err) {
      setVideosError(err instanceof Error ? err.message : 'An error occurred');
    } finally {

      setVideosLoading(false);
    }
  },[apiKey])

  const handleSelectedVideo = useCallback((video: Video) => {
    const videoId = video.id.videoId;
    if (!videoId) return;
    setSelectedVideo(video);
    navigate(`/watch/${videoId}`);
  }, [navigate]);


  useEffect(() => {
    const loadVideos = async ()=>{
      if (isLoggedIn) {
        const videosCache = await  loadFromDB("homeVideosScroll")
        if (videosCache && videosCache.videos && videosCache.videos.length > 0) {
          setVideos(videosCache.videos)
          setVideosNextPageToken(videosCache.nextPageToken ?? null)
          return
        }
          await fetchVideos({})
      }
    }
    loadVideos()

  }, [fetchVideos, isLoggedIn,]);


  return {
    videos,
    videosLoading,
    videosNextPageToken,
    videosError,
    fetchVideos,
    handleSelectedVideo,
  };
}
