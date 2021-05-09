import { AppInstances, WorkspaceState } from "@app-types";
import { WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_STATE_ACK_CHANNEL, WORKSPACE_STATE_CHANNEL } from "@constants";
import { BrowserWindow } from "electron";
import path from "path";
import useIpcMain from "./useIpcMain";
import workspaceStorage from "./workspaceStorage";

export interface WindowProps {
  workspaceId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const createWindow = async (props: WindowProps) => {
  try {
    const workspaceStateChannel = useIpcMain<WorkspaceState>(WORKSPACE_STATE_CHANNEL);
    const workspaceStateAckChannel = useIpcMain(WORKSPACE_STATE_ACK_CHANNEL);
    const widgetBoundsChannel = useIpcMain<{ instances: AppInstances }>(WIDGET_SAVE_BOUNDS_CHANNEL);

    const win = new BrowserWindow({
      transparent: true,
      frame: false,
      hasShadow: false,
      maximizable: true,
      resizable: false,
      skipTaskbar: true,
      focusable: false,
      show: true,
      titleBarStyle: "hidden",
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      webPreferences: {
        nodeIntegrationInSubFrames: true,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        worldSafeExecuteJavaScript: true,
        contextIsolation: false,
        devTools: true,
        webviewTag: true,
      },
    });

    await win.loadFile(path.resolve(__dirname, "../frontend/main.html"));

    workspaceStorage.subscribe(props.workspaceId, (s) => {
      workspaceStateChannel.dispatch(win.webContents, s);
    });

    const sendState = async () => {
      const state = await workspaceStorage.get(props.workspaceId);
      workspaceStateChannel.dispatch(win.webContents, state);
    };

    await new Promise((r) => win.once("ready-to-show", r));

    win.webContents.openDevTools({ mode: "detach" });
    win.webContents.reload();

    // eslint-disable-next-line no-undef
    let interval: NodeJS.Timeout;

    win.webContents.addListener("did-finish-load", () => {
      if (interval) clearInterval(interval);
      interval = setInterval(sendState, 500);
    });

    workspaceStateAckChannel.subscribe((e) => {
      if (e.sender.id === win.id) {
        clearInterval(interval);
        interval = undefined;
        win.show();
      }
    });

    widgetBoundsChannel.subscribe(async (e, payload) => {
      const prevState = await workspaceStorage.get(props.workspaceId);
      await workspaceStorage.update(props.workspaceId, {
        ...prevState,
        instances: payload.instances,
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default createWindow;
