import { Listener } from "@app-types";

export interface Adapter {
  subscribe: <I = any>(channel: string, listener: Listener<I>) => void;
  unsubscribe: <I = any>(channel: string, listener: Listener<I>) => void;
  dispatch: <O = any>(channel: string, event: O) => void;
}

export interface ApiContext {
  subscribe: <I = any>(channel: string, listener: Listener<I>) => void;
  unsubscribe: <I = any>(channel: string, listener: Listener<I>) => void;
  dispatch: <O = any>(channel: string, event: O) => void;
}
