import { useMemo } from "react";
import { useApiClient } from "@components/api-client";
import { Listener } from "@app-types";

interface Channel<I = any, O = I> {
  subscribe: (listener: Listener<I>) => void;
  unsubscribe: (listener: Listener<I>) => void;
  dispatch: (event: O) => void;
}

const useChannel = <I = any, O = I>(channel: string) => {
  const apiClient = useApiClient();
  return useMemo<Channel<I, O>>(
    () => ({
      subscribe: (listener) => apiClient.subscribe<I>(channel, listener),
      unsubscribe: (listener) => apiClient.unsubscribe<I>(channel, listener),
      dispatch: (event) => apiClient.dispatch<O>(channel, event),
    }),
    [channel]
  );
};

export default useChannel;
