import { app, BrowserWindow, Menu, MenuItem, Tray, screen } from "electron";
import path from "path";
import { WidgetInstance, WorkspaceEdit, WorkspaceState } from "@app-types";
import { TRAY_ICON_ID, WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_EDIT_CHANNEL, WORKSPACE_STATE_ACK_CHANNEL, WORKSPACE_STATE_CHANNEL } from "@constants";
import useIpcMain from "./helpers/useIpcMain";
import workspaceStorage from "./helpers/workspaceStorage";
import displayStorage from "./helpers/displayStorage";
// eslint-disable-next-line no-undef
import Timeout = NodeJS.Timeout;

let visible = true;
let contextMenu: Menu;
let tray: Tray; // store out of scope to avoid garbage collection

interface WindowProps {
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
    const widgetBoundsChannel = useIpcMain<{ instances: WidgetInstance[] }>(WIDGET_SAVE_BOUNDS_CHANNEL);

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
    const state = await workspaceStorage.get(props.workspaceId);

    await win.loadFile(path.resolve(__dirname, "../frontend/main.html"));

    workspaceStorage.subscribe(props.workspaceId, (s) => {
      workspaceStateChannel.dispatch(win.webContents, s);
    });

    const sendState = () => {
      workspaceStateChannel.dispatch(win.webContents, state);
    };

    win.once("ready-to-show", async () => {
      win.show();
      win.webContents.openDevTools({ mode: "detach" });
      win.webContents.reload();

      let interval: Timeout;

      win.webContents.addListener("did-finish-load", () => {
        if (interval) clearInterval(interval);
        interval = setInterval(sendState, 500);
      });

      workspaceStateAckChannel.subscribe((e) => {
        if (e.sender.id === win.id) {
          clearInterval(interval);
          interval = undefined;
        }
      });

      widgetBoundsChannel.subscribe(async (e, payload) => {
        const prevState = await workspaceStorage.get(props.workspaceId);
        await workspaceStorage.update(props.workspaceId, {
          ...prevState,
          widgetInstances: payload.instances,
        });
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const createTray = async (): Promise<void> => {
  try {
    const workspaceEditChannel = useIpcMain<WorkspaceEdit>(WORKSPACE_EDIT_CHANNEL);
    tray = new Tray(path.resolve(__dirname, "./image/icon.png"), TRAY_ICON_ID);
    if (process.platform === "win32") {
      tray.destroy();
      tray = new Tray(path.resolve(__dirname, "./image/icon.png"), TRAY_ICON_ID);
    }
    tray.setToolTip("Desktop");
    contextMenu = new Menu();
    contextMenu.append(
      new MenuItem({
        type: "normal",
        label: "Reload all",
        click: () => {
          BrowserWindow.getAllWindows().forEach((w) => w.reload());
        },
      })
    );
    contextMenu.append(
      new MenuItem({
        type: "checkbox",
        label: "Edit mode",
        click: (item) => {
          BrowserWindow.getAllWindows().forEach((w) => {
            workspaceEditChannel.dispatch(w.webContents, { isEdit: item.checked });
          });
        },
      })
    );
    contextMenu.append(
      new MenuItem({
        type: "normal",
        label: "Close",
        click: () => {
          BrowserWindow.getAllWindows().forEach((w) => w.close());
        },
      })
    );
    tray.setContextMenu(contextMenu);
    tray.addListener("click", () => {
      BrowserWindow.getAllWindows().forEach((w) => {
        if (visible) {
          w.hide();
        } else {
          w.show();
        }
      });
      visible = !visible;
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const restoreWindows = async (): Promise<void> => {
  const displays = screen.getAllDisplays();
  await Promise.all(
    displays.map(async (display) => {
      const workspaceId = await displayStorage.getWorkspace(`${display.id}`);
      await createWindow({
        workspaceId,
        // added -1 to solve black window issue
        x: display.workArea.x - 1,
        y: display.workArea.y - 1,
        width: display.workArea.width,
        height: display.workArea.height,
      });
    })
  );

  BrowserWindow.getAllWindows().forEach((w) => w.webContents.reload());
};

(async () => {
  try {
    await app.whenReady();
    await createTray();
    await restoreWindows();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

process.addListener("beforeExit", () => {
  if (tray && !tray.isDestroyed()) tray.destroy();
});

app.on("window-all-closed", () => {
  if (tray && !tray.isDestroyed()) tray.destroy();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await restoreWindows();
  }
});
