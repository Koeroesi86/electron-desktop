import React, { useContext, useEffect, useState } from "react";
import { Adapter, ApiContext } from "./types";
import IpcClientAdapter from "./ipc-client-adapter";

let adapter: Adapter;

export const setAdapter = (a: Adapter) => {
  adapter = a;
};

const context: ApiContext = {
  subscribe: (channel, listener) => {
    if (!adapter) throw new Error("Set adapter first before using context.");
    adapter.subscribe(channel, listener);
  },
  unsubscribe: (channel, listener) => {
    if (!adapter) throw new Error("Set adapter first before using context.");
    adapter.unsubscribe(channel, listener);
  },
  dispatch: (channel, event) => {
    if (!adapter) throw new Error("Set adapter first before using context.");
    adapter.dispatch(channel, event);
  },
};

const ApiClientContext = React.createContext<ApiContext>(context);

export enum AdapterVersion {
  ipc = "IPC",
}

interface ProviderProps {
  adapter: AdapterVersion;
}

const ApiClientProvider: React.FC<ProviderProps> = ({ children, adapter }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    switch (adapter) {
      case AdapterVersion.ipc:
      default:
        setAdapter(new IpcClientAdapter());
    }
    setHasLoaded(true);
  }, [adapter]);
  return <ApiClientContext.Provider value={context}>{hasLoaded ? children : null}</ApiClientContext.Provider>;
};

export const useApiClient = (): ApiContext => useContext<ApiContext>(ApiClientContext);

export default ApiClientProvider;
