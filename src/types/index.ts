import { IpcRendererEvent } from "electron";
import { RevivableComponentType } from "@koeroesi86/react-reviver";
import { WrapperProps } from "../view/components/absolute-wrapper";
import { FixedWrapperProps } from "../view/components/fixed-wrapper";
import { WidgetControlsProps } from "../view/components/widget-controls";
import { WidgetProps } from "../view/components/widget";
import { WorkspaceProps } from "../view/components/workspace";

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

export type RevivableComponent =
  | RevivableComponentType<"absolute-wrapper", WrapperProps, RevivableComponent>
  | RevivableComponentType<"fixed-wrapper", FixedWrapperProps, RevivableComponent>
  | RevivableComponentType<"widget-control", WidgetControlsProps, RevivableComponent>
  | RevivableComponentType<"widget", WidgetProps, RevivableComponent>
  | RevivableComponentType<"workspace", WorkspaceProps, RevivableComponent>;
