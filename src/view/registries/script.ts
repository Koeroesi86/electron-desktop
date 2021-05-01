import { WidgetScript } from "@app-types";

((): void => {
  const scripts: { [k: string]: WidgetScript } = {};

  window.scriptRegistry = {
    add: async (script) => {
      if (!scripts[script.alias]) {
        scripts[script.alias] = script;
      }
    },
    get: (alias: string) => scripts[alias] || { alias, uri: "" }, // not found?
  };
})();
