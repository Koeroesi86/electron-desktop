import { LoadWidget, UnloadWidget } from "../../types";

((): void => {
  interface Widgets {
    [alias: string]: {
      load: LoadWidget;
      unload: UnloadWidget;
      instances: ShadowRoot[];
    };
  }

  const widgets: Widgets = {};

  window.widgetRegistry = {
    register(alias, load, unload = () => {}) {
      if (!widgets[alias]) {
        widgets[alias] = { load, unload, instances: [] };
      }
    },
    unregister(alias) {
      try {
        widgets[alias].instances.forEach((element) => widgets[alias].unload(element));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      } finally {
        widgets[alias] = null;
        delete widgets[alias];
      }
    },
    hasAlias(alias) {
      return widgets[alias] !== undefined;
    },
    load(alias, payload) {
      if (!this.hasAlias(alias)) {
        throw new Error(`No widget registered with alias: ${alias}`);
      }

      widgets[alias].load(payload);
      widgets[alias].instances.push(payload.element);
    },
    unload(alias, element) {
      if (this.hasAlias(alias)) {
        widgets[alias].unload(element);
        widgets[alias].instances.splice(widgets[alias].instances.indexOf(element), 1);
      }
    },
  };
})();
