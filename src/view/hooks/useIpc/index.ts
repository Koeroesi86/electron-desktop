import { ipcRenderer } from "electron";
import { Listener } from "@app-types";

const useIpc = <E = any>(channel: string) => ({
  subscribe: (listener: Listener<E>) => ipcRenderer.on(channel, listener),
  unsubscribe: (listener: Listener<E>) => ipcRenderer.off(channel, listener),
  dispatch: (event?: E) => ipcRenderer.send(channel, event),
});

export default useIpc;
