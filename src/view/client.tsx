import React from "react";
import { render } from "react-dom";
import "./registries/script";
import { WidgetScript } from "@app-types";
import App from "../components/app";

declare global {
  interface ScriptRegistry {
    add: (script: WidgetScript) => Promise<void>;
    get: (alias) => WidgetScript;
  }

  interface Window {
    scriptRegistry: ScriptRegistry;
  }
}

if (window) {
  render(<App />, document.getElementById("root"));
}
