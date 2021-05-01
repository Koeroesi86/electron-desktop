import { WidgetScript } from "@app-types";
import path from "path";

((): void => {
  const scripts: { [k: string]: WidgetScript } = {};

  window.scriptRegistry = {
    add: async (script) => {
      if (!scripts[script.alias]) {
        scripts[script.alias] = script;
      }
    },
    get: (alias: string) =>
      scripts[alias] || { alias, uri: `file://${path.resolve(process.cwd(), "./examples/notfound.html").replace(/\\/g, "/")}?alias=${alias}` },
  };
})();
