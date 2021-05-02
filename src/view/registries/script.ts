import { WidgetScript } from "@app-types";
import path from "path";

((): void => {
  const scripts: { [k: string]: WidgetScript } = {};

  window.scriptRegistry = {
    add: async (alias, script) => {
      if (!scripts[alias]) {
        scripts[alias] = script;
      }
    },
    get: (alias: string) =>
      scripts[alias] || { name: alias, uri: `file://${path.resolve(process.cwd(), "./examples/notfound.html").replace(/\\/g, "/")}?alias=${alias}` },
  };
})();
