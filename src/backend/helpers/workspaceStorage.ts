import { WorkspaceState } from "@app-types";
import defaultWorkspace from "../defaults/workspace";
import configStorage from "./configStorage";

type Listener = (state: WorkspaceState) => void | Promise<void>;
const listeners: { [id: string]: Listener[] } = {};

const CONFIG_FILE = "workspaces.json";

interface WorkspaceRegistry {
  [id: string]: WorkspaceState;
}

const getConfig = async (): Promise<WorkspaceRegistry> => configStorage.get<WorkspaceRegistry>(CONFIG_FILE, {});

const workspaceStorage = {
  update: async (id: string, state: WorkspaceState): Promise<void> => {
    const store = await getConfig();

    store[id] = state;

    await configStorage.set(CONFIG_FILE, store);

    if (listeners[id]) {
      listeners[id].forEach((listener) => listener(store[id]));
    }
  },
  get: async (id: string): Promise<WorkspaceState> => {
    const store = await getConfig();

    if (!store[id]) {
      store[id] = JSON.parse(JSON.stringify(defaultWorkspace)) as WorkspaceState;

      await configStorage.set(CONFIG_FILE, store);
    }

    return store[id];
  },
  subscribe: (id: string, listener: Listener): void => {
    if (!listeners[id]) {
      listeners[id] = [];
    }

    if (!listeners[id].includes(listener)) {
      listeners[id].push(listener);
    }
  },
  unsubscribe: (id: string, listener: Listener): void => {
    if (listeners[id] && listeners[id].includes(listener)) {
      listeners[id].splice(listeners[id].indexOf(listener), 1);
    }
  },
};

export default workspaceStorage;
