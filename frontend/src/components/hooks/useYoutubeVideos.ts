import React, { useCallback, useEffect, useState } from 'react';
import { Video } from '../../types/youtubeVideoInterfaces.ts';
import { loadFromDB, saveToDB } from '../../utils/videoCacheDb/videoCacheDB.ts';
import { fetchVideoStatistics } from '../../helpers/fetchVideoStatistics.ts';
import { fetchChannelDetails } from '../../helpers/fetchChannelDetails.ts';
import axios from 'axios';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useIntersectionObserver } from './useIntersectionObserver.ts';
import { getVideoId } from '../../helpers/getVideoId.ts';


interface UseYoutubeVideoOptions {
  videosLoading: boolean;
  videosError: string | null;
  videos: Video[]
  sentinelRef: React.RefObject<HTMLDivElement>
}

export default function useYoutubeVideos(
  apiKey?: string,
  maxResult?: number,
  myRating?: boolean,

): UseYoutubeVideoOptions {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [videosNextPageToken, setVideosNextPageToken] = useState<string | null>(null);

  const MAX_LIMIT:  number = 50
  const {state:{isLoggedIn},loadingQuery} = useUser()


  const loadMoreVideos =  async () => {
    if (!videosNextPageToken) return;
    await fetchVideos({pageToken:videosNextPageToken, myRating})
  }

  const sentinelRef = useIntersectionObserver(loadMoreVideos, videosLoading, videos.length,MAX_LIMIT)

  const fetchVideos = useCallback(async ({pageToken, query="trending", myRating}:{pageToken?:string, query?:string, myRating?:boolean}) => {

    if (videosLoading) return;

    setVideosLoading(true);
    setVideosError(null);

    try {

      let url: string;

      if (myRating) {

        url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet&myRating=like${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}`;
      } else {

        url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&q=${query}${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}&regionCode=US`;
      }

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


      const videoIds: string[]  = videoItems.map(video=>getVideoId(video.id))


      const channelIds: string[] = [...new Set(videoItems.map((video: Video) => video.snippet.channelId))];


      const statisticsMap = await fetchVideoStatistics(videoIds);

      const channelMap = await fetchChannelDetails(channelIds);


      const videos = videoItems.map((video: Video) => {

        const _videoId = getVideoId(video.id)

        return{
          ...video,
          id:{
            videoId: _videoId
          },
          statistics: {
            ...video.statistics,
            viewCount: statisticsMap[_videoId]?.viewCount,
            likeCount: statisticsMap[_videoId]?.likeCount,
            dislikeCount: statisticsMap[_videoId]?.dislikeCount,
            commentCount: statisticsMap[_videoId]?.commentCount,
            duration: statisticsMap[_videoId]?.duration,
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
            categoryId: video.snippet.categoryId,
          },
        }
      })


      setVideos ((previous)=>{
        const existingIds = new Set(previous.map(v=> getVideoId(v.id)))
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
    if (!isLoggedIn && loadingQuery) return

    const load = async () => {
      try{
        setVideos([])
        setVideosNextPageToken(null)
        const cachedData = await loadFromDB('homeVideosScroll')
        if (cachedData &&  Array.isArray(cachedData.videos) && cachedData.videos.length > 0 ) {
            setVideos(cachedData.videos)
            setVideosNextPageToken(cachedData.nextPageToken || null)
        }else{

          await fetchVideos({myRating})
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
