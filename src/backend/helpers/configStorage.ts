import fs from "fs";
import path from "path";
import { app } from "electron";
import throttle from "lodash.throttle";

const root = app.getPath("userData");

const resolvePath = (fileName: string) => path.resolve(root, fileName);

const throttledStore: { [p: string]: string } = {};

const write = (fileName: string, data: string): void => {
  fs.writeFileSync(resolvePath(fileName), data, "utf8");
};

const read = (fileName: string): string => fs.readFileSync(resolvePath(fileName), "utf8");

const exists = (fileName: string): boolean => fs.existsSync(resolvePath(fileName));

const throttledWrite = throttle<(f: string, d: string) => void>(write, 5000);

process.on("beforeExit", () => {
  throttledWrite.cancel();
  Object.keys(throttledStore).forEach((p) => write(p, throttledStore[p]));
});

const configStorage = {
  set: async (fileName: string, data: any): Promise<void> => {
    const target = JSON.stringify(data, null, 2);

    if (throttledStore[fileName] !== target) {
      throttledStore[fileName] = target;
      throttledWrite(fileName, target);
    }
  },
  exists: async (fileName: string): Promise<boolean> => {
    if (throttledStore[fileName]) {
      return true;
    }

    return exists(fileName);
  },
  get: async <T = any>(fileName: string): Promise<T> => {
    let content = throttledStore[fileName];

    if (!content) {
      content = read(fileName);
      throttledStore[fileName] = content;
    }

    return JSON.parse(content) as T;
  },
};

export default configStorage;
