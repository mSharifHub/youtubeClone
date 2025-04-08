import { openDB } from 'idb';
import { Video } from '../../components/hooks/useYoutubeVideos.ts';

const DB_NAME = 'videoCacheDB';
const STORE_NAME = 'videos';


export const initVideoDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    },
  });
};

export const saveToDB = async (key: string, value: Video[]) => {
  const db = await initVideoDB();
  await db.put(STORE_NAME, { key, value });
};

export const loadFromDB = async (key: string): Promise<Video[]> => {
  const db = await initVideoDB();
  const record = await db.get(STORE_NAME, key);
  return record?.value || [];
};

