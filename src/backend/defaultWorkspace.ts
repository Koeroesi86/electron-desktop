import path from "path";
import { WidgetInstance } from "../types";

export default {
  widgetScripts: [path.resolve(process.cwd(), "examples/clock.js"), path.resolve(process.cwd(), "examples/system.js")],
  widgetInstances: [
    {
      alias: "system",
      id: "9b9ed5a5-d673-4c85-9cd0-2b3a36656098",
      state: "",
      top: 2,
      left: 83,
      width: 15,
      height: 20,
    },
    {
      alias: "clock",
      id: "49e9c5b4-900a-4cf7-8f9e-310e34a94cf1",
      state: "",
      top: 24,
      left: 83,
      width: 15,
      height: 20,
    },
  ] as WidgetInstance[],
};
