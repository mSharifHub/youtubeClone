// const fetchRelatedVideos = async (categoryId: string, pageToken?: string ) =>{
//
//   if (relatedVideosLoading) return
//
//   setRelatedVideosLoading(true);
//   setVideosError(null);
//
//   try{
//
//     let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&maxResults=${maxResult}&type=video&videoCategoryId=${categoryId}`
//     if (pageToken) url += `&pageToken=${pageToken}`;
//
//     const response = await axios.get(url)
//
//     if (response.status === 200) {
//       if (!response.data.items || response.data.items.length === 0) {
//         return
//       }
//
//       if (response.data.nextPageToken) {
//         const newPageToken = response.data.nextPageToken;
//         setVideosNextPageToken(newPageToken);
//       }
//
//       const videoItems: Video[] = response.data.items;
//       const videoIds : string[] = videoItems.map((video:Video)=>video.id.videoId)
//       const channelIds: string[] = [...new Set(videoItems.map((video:Video)=>video.snippet.channelId))]
//       const statisticsMap = await fetchVideoStatistics(videoIds);
//       const channelMap = await fetchChannelDetails(channelIds);
//
//       const videos = videoItems.map((video: Video) => ({
//         ...video,
//         statistics: {
//           viewCount: statisticsMap[video.id.videoId]?.viewCount,
//           likeCount: statisticsMap[video.id.videoId]?.likeCount,
//           dislikeCount: statisticsMap[video.id.videoId]?.dislikeCount,
//           commentCount: statisticsMap[video.id.videoId]?.commentCount,
//           duration: statisticsMap[video.id.videoId]?.duration,
//         },
//         snippet: {
//           title: video.snippet.title,
//           description: video.snippet.description,
//           thumbnails: video.snippet.thumbnails,
//           channelId: video.snippet.channelId,
//           channelTitle: channelMap[video.snippet.channelId]?.channelTitle,
//           channelLogo: channelMap[video.snippet.channelId]?.logo,
//           publishedAt: video.snippet.publishedAt,
//           subscriberCount: channelMap[video.snippet.channelId]?.subscriberCount,
//           channelDescription: channelMap[video.snippet.channelId]?.channelDescription,
//           categoryId: statisticsMap[video.id.videoId]?.categoryId || '',
//
//         },
//       }))
//       setRelatedVideos(videos)
//     }
//   }
//   catch(err){
//     setRelatedVideosError( err instanceof Error ? err.message : 'Failed to fetch related videos details.');
//   }
//   finally {
//     setRelatedVideosLoading(false);
//   }
//
// }

// const fetchVideoById = async (videoId: string) => {
//
//   if (videosLoading) {
//     return;
//   }
//
//   setVideosLoading(true);
//   setVideosError(null);
//
//   try{
//
//     const url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId}&part=snippet,statistics,contentDetails`
//
//     const response = await axios.get(url)
//
//     if (response.status === 200) {
//       const videoData  = response.data.items[0]
//       const channelId = videoData.snippet.channelId
//
//       const channelRes = await axios.get(
//         `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=snippet,statistics`
//       );
//
//       const channelData = channelRes.data.items[0]
//
//       const video = {
//         id: {
//           videoId: videoData.id,
//         },
//         snippet: {
//           title: videoData.snippet.title,
//           description: videoData.snippet.description,
//           thumbnails: videoData.snippet.thumbnails,
//           channelId,
//           channelTitle: channelData?.snippet?.title || '',
//           channelLogo: channelData?.snippet?.thumbnails?.default?.url || '',
//           publishedAt: videoData.snippet.publishedAt,
//           subscriberCount: channelData?.statistics?.subscriberCount || '0',
//           channelDescription: channelData?.snippet?.description || '',
//           categoryId: videoData.snippet?.categoryId || '',
//         },
//         statistics: {
//           viewCount: videoData.statistics?.viewCount || '0',
//           likeCount: videoData.statistics?.likeCount || '0',
//           dislikeCount: videoData.statistics?.dislikeCount || '0',
//           commentCount: videoData.statistics?.commentCount || '0',
//           duration: videoData.contentDetails?.duration || 'PT0S',
//         },
//       };
//       setSingleVideoFetch(video)
//     }
//   }catch(err){
//     setVideosError(err instanceof Error ? err.message : 'An error occurred fetching video by id');
//   }
// }
