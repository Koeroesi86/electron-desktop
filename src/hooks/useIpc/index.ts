import { ipcRenderer } from "electron";
import { Listener } from "@app-types";

const useIpc = <I = any, O = I>(channel: string) => ({
  subscribe: (listener: Listener<I>) => ipcRenderer.on(channel, listener),
  unsubscribe: (listener: Listener<I>) => ipcRenderer.off(channel, listener),
  dispatch: (event: O) => ipcRenderer.send(channel, event),
});

export default useIpc;
