import { useSaveVideoHistoryMutation, VideoHistoryNodeEdge } from '../../graphql/types.ts';

export const useSaveVideoHistory = () => {
  const [saveVideo, { loading, error, data }] = useSaveVideoHistoryMutation({
    update(cache, { data }) {
      const payload = data?.saveVideoHistory;
      if (!payload?.videoHistory) return;

      cache.modify({
        fields: {
          viewerVideoHistory(existing = { edges: [] }) {
            const newEdge = {
              __typename: 'VideoHistoryEdge',
              cursor: payload.cursor,
              node: {
                ...payload.videoHistory,
                __typename: 'VideoHistoryNode',
              },
            };

            return {
              ...existing,
              edges: [newEdge as VideoHistoryNodeEdge, ...existing.edges],
            };
          },
        },
      });
    },
  });

  return {
    saveVideo,
    data,
    loading,
    error,
  };
};
