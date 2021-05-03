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

const getConfig = async (): Promise<DisplayRegistry> => configStorage.get<DisplayRegistry>(CONFIG_FILE, {});

const displayStorage = {
  getDisplay: async (displayId: string): Promise<Display> => {
    const store = await getConfig();

    if (!store[displayId]) {
      store[displayId] = {
        ...defaultDisplay,
        workspaceId: v5(`${displayId}-${defaultDisplay.workspaceId}`, NAMESPACE),
      };

      await configStorage.set(CONFIG_FILE, store);
    }

    return store[displayId];
  },
  setDisplay: async (displayId: string, display: Display): Promise<void> => {
    const store = await getConfig();

    store[displayId] = display;

    await saveConfig(store);
  },
};

export default displayStorage;
