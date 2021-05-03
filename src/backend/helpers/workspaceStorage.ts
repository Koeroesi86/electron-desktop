import { WorkspaceState } from "@app-types";
import defaultWorkspace from "../defaultWorkspace";
import configStorage from "./configStorage";

type Listener = (state: WorkspaceState) => void | Promise<void>;
const listeners: { [id: string]: Listener[] } = {};

const CONFIG_FILE = "workspaces.json";

interface WorkspaceRegistry {
  [id: string]: WorkspaceState;
}

const saveConfig = async (registry: WorkspaceRegistry): Promise<void> => {
  await configStorage.set(CONFIG_FILE, registry);
};

const ensureConfig = async () => {
  if (!(await configStorage.exists(CONFIG_FILE))) {
    await saveConfig({});
  }
};

const getConfig = async (): Promise<WorkspaceRegistry> => {
  await ensureConfig();
  return configStorage.get<WorkspaceRegistry>(CONFIG_FILE);
};

const getWorkspace = async (workspaceId: string): Promise<WorkspaceState> => {
  const store = await getConfig();

  if (!store[workspaceId]) {
    store[workspaceId] = {
      ...defaultWorkspace,
    };

    await configStorage.set(CONFIG_FILE, store);
  }

  return store[workspaceId];
};

const workspaceStorage = {
  update: async (id: string, state: WorkspaceState): Promise<void> => {
    const store = await getConfig();

    store[id] = state;

    await saveConfig(store);

    if (listeners[id]) {
      listeners[id].forEach((listener) => listener(store[id]));
    }
  },
  get: async (id: string): Promise<WorkspaceState> => getWorkspace(id),
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
