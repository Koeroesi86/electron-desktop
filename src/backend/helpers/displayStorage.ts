import { Display } from "@app-types";
import configStorage from "./configStorage";

const CONFIG_FILE = "displays.json";

const defaultDisplay: Display = {
  workspaceId: "25f9c603-a4e3-5267-b280-927cede84ed4",
};

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
      ...defaultDisplay,
      ...(await getDisplay(displayId)),
      workspaceId,
    };

    await saveConfig(store);
  },
};

export default displayStorage;
