import { app, BrowserWindow } from "electron";
import createTray from "./helpers/createTray";
import restoreWindows from "./helpers/restoreWindows";

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

app.on("window-all-closed", () => {
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
