import fs from "fs";
import path from "path";
import throttle from "lodash.throttle";

type FileWrite = (fileName: string, data: string) => void;

// from node_modules/@types/lodash/common/function.d.ts:371
interface DebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

class FileStorage {
  throttledStore: { [p: string]: string } = {};

  private readonly root: string;

  throttledWrite: FileWrite;

  private readonly writeThrottle: DebouncedFunc<FileWrite>;

  constructor(root: string, writeThrottleInterval: number = 5000) {
    this.root = root;
    this.writeThrottle = throttle<FileWrite>(this.write, writeThrottleInterval);

    this.throttledWrite = (fileName: string, data: string) => {
      if (this.throttledStore[fileName] !== data) {
        this.throttledStore[fileName] = data;
        this.writeThrottle(fileName, data);
      }
    };

    process.on("exit", () => {
      this.writeThrottle.cancel();
      Object.keys(this.throttledStore).forEach((p) => this.write(p, this.throttledStore[p]));
    });
  }

  private resolvePath = (fileName: string) => path.resolve(this.root, fileName);

  read = (fileName: string): string => {
    let content = this.throttledStore[fileName];

    if (!content) {
      content = fs.readFileSync(this.resolvePath(fileName), "utf8");
      this.throttledStore[fileName] = content;
    }

    return content;
  };

  exists = (fileName: string): boolean => {
    if (this.throttledStore[fileName]) {
      return true;
    }

    return fs.existsSync(this.resolvePath(fileName));
  };

  private write = (fileName: string, data: string): void => {
    fs.writeFileSync(this.resolvePath(fileName), data, "utf8");
  };
}

export default FileStorage;
