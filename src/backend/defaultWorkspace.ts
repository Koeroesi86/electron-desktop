import path from "path";
import { WidgetInstance } from "../types";

export default {
  widgetScripts: [
    path.resolve(process.cwd(), "examples/clock.js"),
    path.resolve(process.cwd(), "examples/cpu.js"),
    path.resolve(process.cwd(), "examples/memory.js"),
    path.resolve(process.cwd(), "examples/disk.js"),
  ],
  widgetInstances: [
    {
      alias: "clock",
      id: "49e9c5b4-900a-4cf7-8f9e-310e34a94cf1",
      state: "",
      top: 38,
      left: 83,
      width: 15,
      height: 20,
    },
    {
      alias: "cpu",
      id: "9b9ed5a5-d673-4c85-9cd0-2b3a36656098",
      state: "",
      top: 2,
      left: 83,
      width: 15,
      height: 10,
    },
    {
      alias: "memory",
      id: "fff48900-d442-4dd2-b97b-cfd9dc533310",
      state: "",
      top: 14,
      left: 83,
      width: 15,
      height: 10,
    },
    {
      alias: "disk",
      id: "a556ad9d-f8be-4a23-bca1-64b27276bf8f",
      state: "",
      top: 26,
      left: 83,
      width: 15,
      height: 10,
    },
  ] as WidgetInstance[],
};
