

class LocalCache {
  private static instance: LocalCache;

  private constructor() {}

  public static getInstance(): LocalCache {
    if (!LocalCache.instance) {
      LocalCache.instance = new LocalCache();
    }
    return LocalCache.instance;
  }

  public set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    console.log('getting from local storage');
    return value ? (JSON.parse(value) as T) : null;
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}

export default LocalCache;
