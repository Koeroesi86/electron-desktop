import { Listener } from "@app-types";
import { ipcRenderer } from "electron";
import { Adapter } from "@components/api-client/types";

export default class IpcClientAdapter implements Adapter {
  subscribe = <I = any>(channel: string, listener: Listener<I>) => ipcRenderer.on(channel, listener);

  unsubscribe = <I = any>(channel: string, listener: Listener<I>) => ipcRenderer.off(channel, listener);

  dispatch = <O = any>(channel: string, event: O) => ipcRenderer.send(channel, event);
}
