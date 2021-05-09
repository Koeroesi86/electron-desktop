import { app, Menu, Tray } from "electron";
import { TrayConfig } from "./createTray";

let tray: Tray; // store out of scope to avoid garbage collection

const createElectronTray = async (config: TrayConfig): Promise<void> => {
  if (tray) return;

  tray = new Tray(config.icon, config.id);

  if (process.platform === "win32") {
    tray.destroy();
    tray = new Tray(config.icon, config.id);
  }

  tray.setToolTip(config.tooltip);
  tray.setContextMenu(Menu.buildFromTemplate(config.contextMenu));
  tray.addListener("click", config.click);

  process.addListener("beforeExit", () => {
    if (tray && !tray.isDestroyed()) tray.destroy();
  });

  app.on("window-all-closed", () => {
    if (tray && !tray.isDestroyed()) tray.destroy();
  });
};

export default createElectronTray;
