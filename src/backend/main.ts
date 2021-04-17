import { app, BrowserWindow, ipcMain, Menu, MenuItem, Tray, screen } from "electron";
import path from "path";
import { WidgetBounds, WidgetInstance, WidgetStateSave, WorkspaceState } from "@app-types";
import {
  TRAY_ICON_ID,
  WIDGET_SAVE_BOUNDS_CHANNEL,
  WIDGET_SAVE_STATE_CHANNEL,
  WORKSPACE_EDIT_CHANNEL,
  WORKSPACE_STATE_ACK_CHANNEL,
  WORKSPACE_STATE_CHANNEL,
} from "../constants";
import defaultWorkspace from "./defaultWorkspace";
// eslint-disable-next-line no-undef
import Timeout = NodeJS.Timeout;

let visible = true;
let contextMenu: Menu;
let tray: Tray; // store out of scope to avoid garbage collection

interface WindowProps {
  widgetScripts: string[];
  widgetInstances: WidgetInstance[];
  x: number;
  y: number;
  width: number;
  height: number;
}

const createWindow = async (props: WindowProps) => {
  try {
    const win = new BrowserWindow({
      transparent: true,
      frame: false,
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
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        worldSafeExecuteJavaScript: true,
        contextIsolation: false,
        devTools: true,
      },
    });

    // and load the index.html of the app.
    await win.loadFile(path.resolve(__dirname, "../frontend/main.html"));

    const sendState = () => {
      win.webContents.send(WORKSPACE_STATE_CHANNEL, {
        widgetScripts: props.widgetScripts,
        widgetInstances: props.widgetInstances,
      } as WorkspaceState);
    };

    win.once("ready-to-show", async () => {
      win.show();
      // @ts-ignore
      win.openDevTools();
      win.reload();

      let interval: Timeout;

      win.webContents.addListener("did-finish-load", () => {
        if (interval) clearInterval(interval);
        interval = setInterval(sendState, 500);
      });

      ipcMain.on(WORKSPACE_STATE_ACK_CHANNEL, (e) => {
        if (e.sender.id === win.id) {
          clearInterval(interval);
          interval = undefined;
        }
      });

      ipcMain.on(WIDGET_SAVE_BOUNDS_CHANNEL, (e, payload: WidgetBounds) => {
        // TODO: persist
        console.log(`[${Date.now()}] save-widget-bounds`, payload);
      });

      ipcMain.on(WIDGET_SAVE_STATE_CHANNEL, (e, payload: WidgetStateSave) => {
        // TODO: persist
        console.log(`[${Date.now()}] save-widget-state`, payload);
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const createTray = async (): Promise<void> => {
  try {
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
            w.webContents.send(WORKSPACE_EDIT_CHANNEL, { isEdit: item.checked });
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
    displays.map((display) =>
      createWindow({
        widgetScripts: defaultWorkspace.widgetScripts,
        widgetInstances: defaultWorkspace.widgetInstances,
        x: display.workArea.x,
        y: display.workArea.y,
        width: display.workArea.width,
        height: display.workArea.height,
      })
    )
  );

  BrowserWindow.getAllWindows().forEach((w) => w.reload());
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
