import { useSaveVideoPlaylistMutation, VideoPlaylistEntryNodeEdge } from '../../graphql/types.ts';

export const useSaveVideoOnPlaylist = () => {
  const [saveVideoPlaylist, { data, loading, error }] = useSaveVideoPlaylistMutation({
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
                edges: [newEdge, ...(existing.videoEntries.edges || []).filter((edge: VideoPlaylistEntryNodeEdge) => edge.node?.video?.videoId !== videoEntry.video?.videoId)],
              },
            };
          },
        },
      });
    },
  });

  return {
    saveVideoPlaylist,
    data,
    loading,
    error,
  };
};
