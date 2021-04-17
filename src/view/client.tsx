import React from "react";
import { render } from "react-dom";
import "./registries/script";
import "./registries/widget";
import { LoadWidget, LoadWidgetPayload, UnloadWidget } from "@app-types";
import App from "../components/app";

declare global {
  interface WidgetRegistry {
    register: (alias: string, load: LoadWidget, unload?: UnloadWidget) => void;
    unregister: (alias: string) => void;
    hasAlias: (alias: string) => boolean;
    load: (alias: string, payload: LoadWidgetPayload) => void;
    unload: (alias: string, element: ShadowRoot) => void;
  }

  interface ScriptRegistry {
    add: (src: string) => Promise<void>;
  }

  interface Window {
    widgetRegistry: WidgetRegistry;
    scriptRegistry: ScriptRegistry;
  }
}

if (window) {
  render(<App />, document.getElementById("root"));
}
