import { IpcRendererEvent } from "electron";

export interface WidgetScript {
  name: string;
  uri: string;
}

export interface WidgetInstance {
  alias: string;
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface AppCollection {
  [alias: string]: WidgetScript;
}

export interface AppInstances {
  [id: string]: WidgetInstance;
}

export interface WorkspaceState {
  apps: AppCollection;
  instances: AppInstances;
}

export interface Display {
  workspaceId: string;
}

export interface WorkspaceStateSave {
  instances: AppInstances;
}

export interface WorkspaceEdit {
  isEdit: boolean;
}

export type Listener<E = any> = (ipcEvent: IpcRendererEvent, event: E) => void | Promise<void>;
