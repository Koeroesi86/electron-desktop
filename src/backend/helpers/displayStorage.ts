import { v5 } from "uuid";
import { Display } from "@app-types";
import { NAMESPACE } from "@constants";
import defaultDisplay from "../defaults/display";
import configStorage from "./configStorage";

const CONFIG_FILE = "displays.json";

interface DisplayRegistry {
  [id: string]: Display;
}

const saveConfig = async (registry: DisplayRegistry): Promise<void> => {
  await configStorage.set(CONFIG_FILE, registry);
};

const ensureConfig = async () => {
  if (!(await configStorage.exists(CONFIG_FILE))) {
    await saveConfig({});
  }
};

const getConfig = async (): Promise<DisplayRegistry> => {
  await ensureConfig();
  return configStorage.get<DisplayRegistry>(CONFIG_FILE);
};

const getDisplay = async (displayId: string): Promise<Display> => {
  const store = await getConfig();

  if (!store[displayId]) {
    store[displayId] = {
      ...defaultDisplay,
      workspaceId: v5(`${displayId}-${defaultDisplay.workspaceId}`, NAMESPACE),
    };

    await configStorage.set(CONFIG_FILE, store);
  }

  return store[displayId];
};

const displayStorage = {
  getWorkspace: async (displayId: string): Promise<string> => {
    const display = await getDisplay(displayId);

    return display.workspaceId;
  },
  setWorkspace: async (displayId: string, workspaceId: string): Promise<void> => {
    const store = await getConfig();

    store[displayId] = {
      ...(await getDisplay(displayId)),
      workspaceId,
    };

    await saveConfig(store);
  },
};

export default displayStorage;
