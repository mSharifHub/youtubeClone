import { useNavigate } from 'react-router-dom';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { useCallback } from 'react';
import { useSaveVideoPlaylistMutation, VideoNode, VideoPlaylistEntryNodeEdge } from '../../graphql/types.ts';

export const useHandleSelectedVideo = () => {
  const navigate = useNavigate();

  const [saveVideoPlaylist, { loading, error }] = useSaveVideoPlaylistMutation({
    update(cache, { data }) {
      const payload = data?.saveVideoPlaylist;
      const videoEntry = payload?.videoEntry;

      if (!videoEntry) return;

      cache.modify({
        fields: {
          viewerVideoPlaylist(existing = { videoEntries: { edges: [] } }) {
            const newEdge = {
              __typename: 'VideoPlaylistEntryNodeEdge',
              cursor: payload.cursor,
              node: {
                ...videoEntry,
                __typename: 'VideoPlaylistEntryNode',
              },
            };

            return {
              ...existing,
              videoEntries: {
                ...existing.videoEntries,
                edges: [newEdge, ...(existing.videoEntries.edges || []).filter((edge: VideoPlaylistEntryNodeEdge) => edge.node?.video.videoId !== videoEntry.video.videoId)],
              },
            };
          },
        },
      });
    },
  });

  const { setSelectedVideo } = useSelectedVideo();

  return useCallback(
    async (video: VideoNode) => {
      if (!video) return;

      setSelectedVideo(video);

      if (!loading && !error) {
        await saveVideoPlaylist({
          variables: {
            video: {
              id: {
                videoId: video.videoId,
              },
              snippet: {
                title: video.title ?? '',
                description: video.description ?? '',

                thumbnails: {
                  default: { url: video.thumbnailsDefault ?? '' },
                  medium: { url: video.thumbnailsMedium ?? '' },
                },
                channelId: video.channelId ?? '',
                channelTitle: video.channelTitle ?? '',
                publishedAt: video.publishedAt ?? '',
                categoryId: video.categoryId ?? '',
                channelDescription: video.channelDescription ?? '',
                subscriberCount: video.subscriberCount.toString() ?? '',
                channelLogo: video.channelLogo ?? '',
              },
              statistics: {
                duration: video.duration ?? '',
                viewCount: video.viewCount.toString() ?? '',
                likeCount: video.likeCount.toString() ?? '',
                commentCount: video.commentCount.toString() ?? '',
              },
            },
          },
        });
      }
      navigate(`/watch?v=${video.videoId}`);
    },
    [navigate, setSelectedVideo],
  );
};
