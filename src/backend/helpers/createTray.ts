import { WorkspaceEdit } from "@app-types";
import { TRAY_ICON_ID, WORKSPACE_EDIT_CHANNEL } from "@constants";
import { BrowserWindow } from "electron";
import path from "path";
import useIpcMain from "./useIpcMain";
import createElectronTray from "./createElectronTray";

let visible = true;
let editing = false;

export interface TrayConfig {
  tooltip: string;
  icon: string;
  id: string;
  click: () => void | Promise<void>;
  contextMenu: {
    type: "normal" | "separator" | "submenu" | "checkbox" | "radio";
    label: string;
    click: () => void | Promise<void>;
  }[];
}

const createTray = async (): Promise<void> => {
  try {
    const workspaceEditChannel = useIpcMain<WorkspaceEdit>(WORKSPACE_EDIT_CHANNEL);

    const config: TrayConfig = {
      tooltip: "Desktop",
      icon: path.resolve(__dirname, "./image/icon.png"),
      id: TRAY_ICON_ID,
      click: () => {
        BrowserWindow.getAllWindows().forEach((w) => {
          if (visible) {
            w.hide();
          } else {
            w.show();
          }
        });
        visible = !visible;
      },
      contextMenu: [
        {
          type: "normal",
          label: "Reload all",
          click: () => {
            BrowserWindow.getAllWindows().forEach((w) => w.reload());
          },
        },
        {
          type: "checkbox",
          label: "Edit mode",
          click: () => {
            editing = !editing;
            BrowserWindow.getAllWindows().forEach((w) => {
              workspaceEditChannel.dispatch(w.webContents, { isEdit: editing });
            });
          },
        },
        {
          type: "normal",
          label: "Close",
          click: () => {
            BrowserWindow.getAllWindows().forEach((w) => w.close());
          },
        },
      ],
    };

    await createElectronTray(config);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default createTray;
