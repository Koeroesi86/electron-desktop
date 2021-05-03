import { IpcRendererEvent } from "electron";
import { RevivableComponentType } from "@koeroesi86/react-reviver";
import { WidgetContextMenuProps } from "@components/widget-context-menu";
import { WrapperProps } from "../components/absolute-wrapper";
import { FixedWrapperProps } from "../components/fixed-wrapper";
import { WidgetControlsProps } from "../components/widget-controls";
import { WidgetProps } from "../components/widget";
import { WorkspaceProps } from "../components/workspace";

export interface WidgetScript {
  name: string;
  uri: string;
}

export interface WidgetInstance {
  alias: string;
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface WorkspaceState {
  widgetScripts: { [k: string]: WidgetScript };
  widgetInstances: WidgetInstance[];
}

export interface Display {
  workspaceId: string;
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

export type Listener<E = any> = (ipcEvent: IpcRendererEvent, event: E) => void | Promise<void>;

export type RevivableComponent =
  | RevivableComponentType<"absolute-wrapper", WrapperProps, RevivableComponent>
  | RevivableComponentType<"fixed-wrapper", FixedWrapperProps, RevivableComponent>
  | RevivableComponentType<"widget-control", WidgetControlsProps, RevivableComponent>
  | RevivableComponentType<"widget-context-menu", WidgetContextMenuProps, RevivableComponent>
  | RevivableComponentType<"widget", WidgetProps, RevivableComponent>
  | RevivableComponentType<"workspace", WorkspaceProps, RevivableComponent>;
