import { IpcRendererEvent } from "electron";

export interface LoadWidgetPayload {
  element: ShadowRoot;
  initialState: string;
  onStateChange: (state: string) => void;
}

export type UnloadWidget = (element: ShadowRoot) => void;

export type LoadWidget = (payload: LoadWidgetPayload) => void;

export interface WidgetInstance {
  alias: string;
  id: string;
  state: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface WorkspaceState {
  widgetScripts: string[];
  widgetInstances: WidgetInstance[];
}

export interface WorkspaceStateSave {
  instances: WidgetInstance[];
}

export interface WidgetBounds {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface WorkspaceEdit {
  isEdit: boolean;
}

export interface WidgetStateSave {
  id: string;
  state: string;
}

export type Listener<E = any> = (ipcEvent: IpcRendererEvent, event: E) => void | Promise<void>;
