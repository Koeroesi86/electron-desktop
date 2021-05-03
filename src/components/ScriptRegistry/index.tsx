import React, { useContext } from "react";
import path from "path";
import { WidgetScript } from "@app-types";

interface ScriptRegistry {
  add: (alias: string, script: WidgetScript) => Promise<void>;
  get: (alias: string) => WidgetScript;
}

const registry = {};

const context: ScriptRegistry = {
  add: async (alias, script) => {
    if (!registry[alias]) {
      registry[alias] = script;
    }
  },
  get: (alias: string) =>
    registry[alias] || {
      name: alias,
      uri: `file://${path.resolve(process.cwd(), "./examples/notfound.html").replace(/\\/g, "/")}?alias=${alias}`,
    },
};

const ScriptRegistryContext = React.createContext<ScriptRegistry>(context);

// eslint-disable-next-line react/prop-types
export const ScriptProvider: React.FC = ({ children }) => (
  <ScriptRegistryContext.Provider value={context}>{children}</ScriptRegistryContext.Provider>
);

export const useScriptRegistry = () => useContext<ScriptRegistry>(ScriptRegistryContext);
