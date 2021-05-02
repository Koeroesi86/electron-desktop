import { WorkspaceState } from "@app-types";
import defaultWorkspace from "../defaultWorkspace";

type Listener = (state: WorkspaceState) => void | Promise<void>;
const listeners: { [id: string]: Listener[] } = {};

const inmemory = { "25f9c603-a4e3-5267-b280-927cede84ed4": { ...defaultWorkspace } };

const workspaceStorage = {
  update: async (id: string, state: WorkspaceState): Promise<void> => {
    inmemory[id] = JSON.parse(JSON.stringify(state));

    if (listeners[id]) {
      listeners[id].forEach((listener) => listener(inmemory[id]));
    }
  },
  get: async (id: string): Promise<WorkspaceState> => inmemory[id] || inmemory["25f9c603-a4e3-5267-b280-927cede84ed4"],
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
