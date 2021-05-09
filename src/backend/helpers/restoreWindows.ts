import displayStorage from "./displayStorage";
import createWindow from "./createWindow";
import getCurrentDisplays from "./getCurrentDisplays";

const restoreWindows = async (): Promise<void> => {
  const displays = await getCurrentDisplays();
  await Promise.all(
    displays.map(async (display) => {
      const d = await displayStorage.getDisplay(display.id);
      await createWindow({
        workspaceId: d.workspaceId,
        x: display.x,
        y: display.y,
        width: display.width,
        height: display.height,
      });
    })
  );
};

export default restoreWindows;
