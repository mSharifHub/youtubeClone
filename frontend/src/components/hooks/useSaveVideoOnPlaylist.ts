import { useSaveVideoPlaylistMutation, VideoPlaylistEntryNodeEdge } from '../../graphql/types.ts';

export const useSaveVideoOnPlaylist = () => {
  const [saveVideoPlaylist, { data, loading, error }] = useSaveVideoPlaylistMutation({
    update(cache, { data }) {
      const payload = data?.saveVideoPlaylist;
      const videoEnty = payload?.videoEntry;

      if (!videoEnty) return;

      cache.modify({
        fields: {
          viewerVideoPlaylist(existing = { edges: [] }) {
            const newEdge = {
              __typename: 'VideoPlaylistEntryNodeEdge',
              cursor: payload.cursor,
              node: {
                ...videoEnty,
                __typename: 'VideoPlaylistEntryNode',
              },
            };

            return {
              ...existing,
              edges: [newEdge as VideoPlaylistEntryNodeEdge, ...existing.edges],
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
