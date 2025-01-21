class LocalCache {
  private static instance: LocalCache;
  private readonly MAX_KB_SIZE: number = 1024;

  private constructor() {}

  /* This class is used along with useYoutube Videos to make an api call to the Google API
   to reduce the number of API calls by storing the  videos in a local cache. The content
   should be within a limit to store in local cache. That way we are reducing the number of queried
   */
  public static getInstance(): LocalCache {
    if (!LocalCache.instance) {
      LocalCache.instance = new LocalCache();
    }
    return LocalCache.instance;
  }

  public getSizeInKb(data: string): number {
    return new Blob([...data]).size / 1024;
  }

  public set<T>(key: string, value: T): void {
    const valueString = JSON.stringify(value);
    const sizeInKb = this.getSizeInKb(valueString);

    if (sizeInKb > this.MAX_KB_SIZE) {
      console.error(
        `[Cache] data exceeds max size (${this.MAX_KB_SIZE}). Key: ${key}: ${valueString}, Size: ${sizeInKb} Kb`,
      );

      return;
    }

    console.log(`[Cache] setting key: ${key}`);
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get<T>(key: string): T | null {
    const value = localStorage.getItem(key);

    if (value) {
      console.log(`[Cache] get ${key}`);
      return JSON.parse(value) as T;
    } else {
      console.log(`[Cache] get ${key} not found`);
      return null;
    }
  }

  public remove(key: string): void {
    console.log(`[Cache] remove ${key}`);
    localStorage.removeItem(key);
  }

  public clear(): void {
    if (!localStorage) {
      console.error(`localStorage not found`);
      return;
    }
    console.log(`[Cache] clearing cache`);
    localStorage.clear();
  }
}

export default LocalCache;
