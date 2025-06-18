import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { saveToDB } from '../../utils/videoCacheDb/videoCacheDB.ts';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { fetchVideoStatistics } from '../helpers/fetchVideoStatistics.ts';
import { fetchChannelDetails } from '../helpers/fetchChannelDetails.ts';
import { UseinfiniteScrollOptions, Video } from '../helpers/youtubeVideoInterfaces.ts';
import { useUser } from '../../contexts/userContext/UserContext.tsx';


interface UseYoutubeVideoOptions {
  videosLoading: boolean;
  videosError: string | null;
  handleSelectedVideo: (video:Video) => void;
  videos: Video[]
  fetchVideos: (pageToken?: string) => void;
}


export default function useYoutubeVideos(
  apiKey: string,
  maxResult: number,
  sentinelRef?: React.RefObject<Element>,
  options?: UseinfiniteScrollOptions,


): UseYoutubeVideoOptions {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [videosNextPageToken, setVideosNextPageToken] = useState<string | null>(null);

  const {setSelectedVideo} = useSelectedVideo()
  const navigate = useNavigate();
  const { state: { isLoggedIn } } = useUser();


  const mockFetchYoutubeData = async () => {
    await new Promise((res) => setTimeout(res, 800)); // simulate network delay

    const fakeVideos: Video[] = Array.from({ length: maxResult }).map((_, idx) => {
      const id = `${Math.random().toString(36).substring(7)}-${Date.now()}-${idx}`;
      return {
        id: { videoId: id },
        statistics: {
          viewCount: `${Math.floor(Math.random() * 100000)}`,
          likeCount: `${Math.floor(Math.random() * 1000)}`,
          dislikeCount: `${Math.floor(Math.random() * 200)}`,
          commentCount: `${Math.floor(Math.random() * 500)}`,
          duration: 'PT10M20S',
        },
        snippet: {
          title: `Fake Video Title #${idx}`,
          description: `This is a mock video for testing purposes.`,
          thumbnails: {
            medium: {
              url: `https://via.placeholder.com/320x180?text=Video+${idx}`,
            },
          },
          channelId: `channel-${idx}`,
          channelTitle: `Mock Channel ${idx}`,
          channelLogo: `https://via.placeholder.com/48x48`,
          publishedAt: new Date().toISOString(),
          subscriberCount: `${Math.floor(Math.random() * 10000)}`,
          channelDescription: 'This is a fake channel for testing.',
          categoryId: '10',
        },
      };
    });

    return {
      items: fakeVideos,
      nextPageToken: Math.random().toString(36).substring(2, 8),
    };
  };


  const fetchVideos = useCallback(
    async (pageToken?: string) => {
      if (videosLoading || videos.length >= 500) return;

      setVideosLoading(true);
      setVideosError(null);

      try {
        const response = await mockFetchYoutubeData();
        const videoItems = response.items;

        if (!videoItems || videoItems.length === 0) return;

        if (response.nextPageToken) {
          setVideosNextPageToken(response.nextPageToken);
        }

        setVideos((previous) => {
          const newVideos = videoItems.filter(
            (video) => !previous.some((v) => v.id.videoId === video.id.videoId)
          );
          if (newVideos.length === 0) return previous;
          console.log('newVideos', newVideos.length)
          const updated = [...previous, ...newVideos];
          saveToDB('infiniteScroll', updated);
          return updated;
        });
      } catch (err) {
        setVideosError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setVideosLoading(false);
      }
    },
    [videosLoading, videos]
  );


  // const fetchVideos = useCallback( async (pageToken?: string) => {
  //   if (videosLoading || videos.length >= 50) return;
  //
  //
  //   setVideosLoading(true);
  //   setVideosError(null);
  //
  //   try {
  //     const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}`;
  //
  //     const response = await axios.get(url);
  //
  //     if (response.status === 200) {
  //       if (!response.data.items || response.data.items.length === 0) {
  //         return;
  //       }
  //
  //       if (response.data.nextPageToken.length > 0) {
  //         const newPageToken = response.data.nextPageToken;
  //         setVideosNextPageToken(newPageToken);
  //       }
  //
  //       const videoItems: Video[] = response.data.items;
  //       const videoIds: string[] = videoItems.map((video: Video) => video.id.videoId);
  //
  //       const channelIds: string[] = [...new Set(videoItems.map((video: Video) => video.snippet.channelId))];
  //
  //       const statisticsMap = await fetchVideoStatistics(videoIds);
  //
  //       const channelMap = await fetchChannelDetails(channelIds);
  //
  //       const videos = videoItems.map((video: Video) => ({
  //         ...video,
  //         statistics: {
  //           ...video.statistics,
  //           viewCount: statisticsMap[video.id.videoId]?.viewCount,
  //           likeCount: statisticsMap[video.id.videoId]?.likeCount,
  //           dislikeCount: statisticsMap[video.id.videoId]?.dislikeCount,
  //           commentCount: statisticsMap[video.id.videoId]?.commentCount,
  //           duration: statisticsMap[video.id.videoId]?.duration,
  //         },
  //         snippet: {
  //           ...video.snippet,
  //           title: video.snippet.title,
  //           channelTitle: channelMap[video.snippet.channelId]?.channelTitle,
  //           channelLogo: channelMap[video.snippet.channelId]?.logo,
  //           publishedAt: video.snippet.publishedAt,
  //           subscriberCount: channelMap[video.snippet.channelId]?.subscriberCount,
  //           channelDescription: channelMap[video.snippet.channelId]?.channelDescription,
  //           description: video.snippet.description,
  //           categoryId: statisticsMap[video.id.videoId]?.categoryId || '',
  //         },
  //       }))
  //
  //       setVideos( (previous)=>{
  //         const newVideos = videos.filter(video=> !previous.some(v=>v.id.videoId === video.id.videoId ))
  //         if ( newVideos.length === 0) return previous
  //         const updated = [...previous, ...newVideos]
  //         saveToDB('infiniteScroll', updated);
  //         return updated;
  //       })
  //     }
  //
  //   } catch (err) {
  //     setVideosError(err instanceof Error ? err.message : 'An error occurred');
  //   } finally {
  //
  //     setVideosLoading(false);
  //   }
  // },[videosLoading, videosNextPageToken, videos]);


  const handleSelectedVideo = useCallback((video: Video) => {
    const videoId = video.id.videoId;
    if (!videoId) return;

    setSelectedVideo(video);
    navigate(`/watch/${videoId}`);

  }, [navigate, setSelectedVideo]);

  useEffect(() => {
    if(videos.length === 0) fetchVideos()
  }, [videos.length]);



  useEffect(() => {
    if (!sentinelRef?.current) return

    const node = sentinelRef.current;

    let observer : IntersectionObserver | null = null

    const handleIntersect = async ([entry]: IntersectionObserverEntry[]) => {

      if ( entry.isIntersecting && !videosLoading && videosNextPageToken && isLoggedIn) {
        observer?.unobserve(node);
        await fetchVideos(videosNextPageToken);
        observer?.observe(node);
      }
    }

    observer = new IntersectionObserver(handleIntersect, {
      root: options ? options.root : null,
      rootMargin: options ? options.rootMargin : '',
      threshold: options ? options.threshold : 0
    })

    observer.observe(node);

    return () => {
      observer?.disconnect()
    }

  }, [videosLoading, videosNextPageToken, isLoggedIn, fetchVideos])


  return {
    videos,
    videosLoading,
    videosError,
    handleSelectedVideo,
    fetchVideos,
  };

}
