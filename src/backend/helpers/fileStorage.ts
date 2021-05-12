import fs from "fs";
import path from "path";
import throttle from "lodash.throttle";

type FileWrite = (fileName: string, data: string) => Promise<void>;

// from node_modules/@types/lodash/common/function.d.ts:371
interface DebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

interface CacheProvider<T = any> {
  has: (key: string) => Promise<boolean>;
  get: (key: string) => Promise<T>;
  set: (key: string, data: T, interval?: number) => Promise<void>;
  all: () => Promise<{ [key: string]: T }>;
  flush: () => Promise<void>;
}

class InmemoryCache<T = any> implements CacheProvider<T> {
  private store: { [key: string]: string } = {};

  has = async (key) => typeof this.store[key] === "string";

  get = async (key) => {
    if (!(await this.has(key))) return undefined;

    return JSON.parse(this.store[key]) as T;
  };

  set = async (key, data: T, interval?) => {
    this.store[key] = JSON.stringify(data);

    if (interval > 0) {
      setTimeout(() => {
        this.store[key] = undefined;
        delete this.store[key];
      }, interval);
    }
  };

  all = async () =>
    Object.keys(this.store).reduce((result, key) => ({ ...result, [key]: JSON.parse(this.store[key]) as T }), {});

  flush = async () => {
    Object.keys(this.store).forEach((key) => {
      this.store[key] = undefined;
      delete this.store[key];
    });
  };
}

class FileStorage {
  cache: CacheProvider<string>;

  private readonly root: string;

  throttledWrite: FileWrite;

  private readonly writeThrottle: DebouncedFunc<() => void>;

  constructor(root: string, writeThrottleInterval: number = 5000) {
    this.root = root;
    this.cache = new InmemoryCache<string>();

    this.writeThrottle = throttle(async () => {
      const all = await this.cache.all();
      Object.keys(all).forEach((p) => this.write(p, all[p]));
      await this.cache.flush();
    }, writeThrottleInterval);

    this.throttledWrite = async (fileName: string, data: string) => {
      if ((await this.cache.get(fileName)) !== data) {
        await this.cache.set(fileName, data);
        this.writeThrottle();
      }
    };

    process.on("exit", () => {
      this.writeThrottle.flush();
    });
  }

  private resolvePath = (fileName: string) => path.resolve(this.root, fileName);

  read = async (fileName: string): Promise<string> => {
    let content = await this.cache.get(fileName);

    if (!content) {
      content = fs.readFileSync(this.resolvePath(fileName), "utf8");
      await this.cache.set(fileName, content);
    }

    return content;
  };

  exists = async (fileName: string): Promise<boolean> => {
    if (await this.cache.has(fileName)) {
      return true;
    }

    return fs.existsSync(this.resolvePath(fileName));
  };

  private write = (fileName: string, data: string): void => {
    fs.writeFileSync(this.resolvePath(fileName), data, "utf8");
  };
}

export default FileStorage;
