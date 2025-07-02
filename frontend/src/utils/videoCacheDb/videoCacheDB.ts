import { openDB } from 'idb';
import { Video } from '../../helpers/youtubeVideoInterfaces.ts';

const DB_NAME = 'videoCacheDB';
const STORE_NAME = 'videos';

interface VideoCacheDB {
  videos: Video[] | any[];
  nextPageToken?: string | null;
}

export const initVideoDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    },
  });
};

export const saveToDB = async (key: string, value: VideoCacheDB) => {
  const db = await initVideoDB();
  await db.put(STORE_NAME, { key, value });
};

export const loadFromDB = async (key: string): Promise<VideoCacheDB> => {
  const db = await initVideoDB();
  const record = await db.get(STORE_NAME, key);
  return record?.value || [];
};

export const deleteFromDB = async (key: string): Promise<boolean> => {
  const db = await initVideoDB();
  const existing = await db.get(STORE_NAME, key);
  if (existing) {
    await db.delete(STORE_NAME, key);
    return true;
  } else {
    return false;
  }
};
