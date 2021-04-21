import { ipcMain, IpcMainEvent, WebContents } from "electron";

export type MainListener<E = any> = (ipcEvent: IpcMainEvent, event: E) => void | Promise<void>;

const useIpcMain = <I = any, O = I>(channel: string) => ({
  subscribe: (listener: MainListener<I>) => ipcMain.on(channel, listener),
  unsubscribe: (listener: MainListener<I>) => ipcMain.off(channel, listener),
  dispatch: (target: WebContents, event: O) => target.send(channel, event),
});

export default useIpcMain;
