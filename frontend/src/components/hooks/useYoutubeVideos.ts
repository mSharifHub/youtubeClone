import React, { useCallback, useEffect, useState } from 'react';
import { Video } from '../../types/youtubeVideoInterfaces.ts';
import { loadFromDB, saveToDB } from '../../utils/videoCacheDb/videoCacheDB.ts';
import { fetchVideoStatistics } from '../../helpers/fetchVideoStatistics.ts';
import { fetchChannelDetails } from '../../helpers/fetchChannelDetails.ts';
import axios from 'axios';
import { useIntersectionObserver } from './useIntersectionObserver.ts';
import { useUser } from '../../contexts/userContext/UserContext.tsx';

interface UseYoutubeVideoOptions {
  videosLoading: boolean;
  videosError: string | null;
  videos: Video[]
  sentinelRef: React.RefObject<HTMLDivElement>
}

export default function useYoutubeVideos(
  apiKey?: string,
  maxResult?: number,

): UseYoutubeVideoOptions {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [videosNextPageToken, setVideosNextPageToken] = useState<string | null>(null);

  const MAX_LIMIT:  number = 20
  const {state:{isLoggedIn}} = useUser()


  const loadMoreVideos = async () => {
    if (!videosNextPageToken) return;
    await fetchVideos({pageToken:videosNextPageToken})
  }

  const sentinelRef = useIntersectionObserver(loadMoreVideos, videosLoading, videos.length,MAX_LIMIT)


  const fetchVideos = useCallback(async ({pageToken, query="trending"}:{pageToken?:string, query?:string}) => {

    if (videosLoading) return;

    setVideosLoading(true);
    setVideosError(null);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&q=${query}${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=5&regionCode=US`;

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


  useEffect(() => {
    if (!isLoggedIn) return

    const load = async () => {
      try{
        setVideos([])
        setVideosNextPageToken(null)
        const cachedData = await loadFromDB('homeVideosScroll')
        if (cachedData &&  Array.isArray(cachedData.videos) && cachedData.videos.length > 0 ) {
            setVideos(cachedData.videos)
            setVideosNextPageToken(cachedData.nextPageToken || null)
        }else{
          await fetchVideos({})
        }

      }catch (err){
        setVideosError(err instanceof Error ? err.message : 'An error occurred while loading videos')
        setVideos([])
      }
      finally {
        setVideosLoading(false)
      }

    }
    load()
  }, [isLoggedIn]);


  return {
    videos,
    videosLoading,
    videosError,
    sentinelRef,
  };
}
