import { useEffect } from "react";
import { WindowEventMap } from "@hooks/useWindowEvent/types";

const useWindowEvent = <K extends keyof WindowEventMap>(
  name: K,
  listener: (this: Window, event: WindowEventMap[K]) => any
) => {
  useEffect(() => {
    if (typeof window !== "undefined") window.addEventListener(name, listener);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener(name, listener);
    };
  }, [listener]);
};

export default useWindowEvent;
