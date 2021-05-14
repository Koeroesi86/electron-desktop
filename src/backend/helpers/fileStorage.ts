import fs from "fs";
import path from "path";
// @ts-ignore
import { InmemoryCache } from "@koeroesi86/cache";

type FileWrite = (fileName: string, data: string) => void;

interface CacheProvider<T = any> {
  has: (key: string) => boolean;
  get: (key: string) => T;
  set: (key: string, data: T, interval?: number) => void;
  all: () => { [key: string]: T };
  flush: () => void;
}

class FileStorage {
  cache: CacheProvider<string>;

  private readonly root: string;

  throttledWrite: FileWrite;

  constructor(root: string, writeThrottleInterval: number = 5000) {
    this.root = root;
    this.cache = new InmemoryCache<string>({}, (p, data) => {
      this.write(p, data);
    });

    this.throttledWrite = async (fileName: string, data: string) => {
      if (this.cache.get(fileName) !== data) {
        this.cache.set(fileName, data, writeThrottleInterval);
      }
    };

    process.on("exit", () => {
      const all = this.cache.all();
      Object.keys(all).forEach((p) => this.write(p, all[p]));
    });
  }

  private resolvePath = (fileName: string) => path.resolve(this.root, fileName);

  read = async (fileName: string): Promise<string> => {
    let content = await this.cache.get(fileName);

    if (!content) {
      content = fs.readFileSync(this.resolvePath(fileName), "utf8");
      this.cache.set(fileName, content);
    }

    return content;
  };

  exists = async (fileName: string): Promise<boolean> => {
    if (this.cache.has(fileName)) {
      return true;
    }

    return fs.existsSync(this.resolvePath(fileName));
  };

  private write = (fileName: string, data: string): void => {
    fs.writeFileSync(this.resolvePath(fileName), data, "utf8");
  };
}

export default FileStorage;
