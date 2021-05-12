import { app } from "electron";
import FileStorage from "./fileStorage";

const fileStorage = new FileStorage(app.getPath("userData"), 5000);

const configStorage = {
  set: async (fileName: string, data: any): Promise<void> => {
    const target = JSON.stringify(data, null, 2);

    fileStorage.throttledWrite(fileName, target);
  },
  exists: async (fileName: string): Promise<boolean> => await fileStorage.exists(fileName),
  get: async <T = any>(fileName: string, defaultValue: T): Promise<T> => {
    if (!(await configStorage.exists(fileName))) {
      await configStorage.set(fileName, defaultValue);
    }

    const content = await fileStorage.read(fileName);

    return JSON.parse(content) as T;
  },
};

export default configStorage;
