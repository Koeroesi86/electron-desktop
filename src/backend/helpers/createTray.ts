import { WorkspaceEdit } from "@app-types";
import { TRAY_ICON_ID, WORKSPACE_EDIT_CHANNEL } from "@constants";
import { app, BrowserWindow, Menu, MenuItem, Tray } from "electron";
import path from "path";
import useIpcMain from "./useIpcMain";

let visible = true;
let tray: Tray; // store out of scope to avoid garbage collection
let contextMenu: Menu;

const createTray = async (): Promise<void> => {
  try {
    if (tray) return;

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

    process.addListener("beforeExit", () => {
      if (tray && !tray.isDestroyed()) tray.destroy();
    });

    app.on("window-all-closed", () => {
      if (tray && !tray.isDestroyed()) tray.destroy();
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default createTray;
