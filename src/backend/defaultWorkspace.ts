import path from "path";
import {WidgetInstance} from "../view/types";

export default {
  widgetScripts: [
    path.resolve(process.cwd(), 'examples/clock.js'),
    path.resolve(process.cwd(), 'examples/cpu.js'),
    path.resolve(process.cwd(), 'examples/memory.js'),
    path.resolve(process.cwd(), 'examples/disk.js'),
  ],
  widgetInstances: [
    {
      alias: 'clock',
      top: 38,
      left: 83,
      width: 15,
      height: 20
    },
    {
      alias: 'cpu',
      top: 2,
      left: 83,
      width: 15,
      height: 10
    },
    {
      alias: 'memory',
      top: 14,
      left: 83,
      width: 15,
      height: 10
    },
    {
      alias: 'disk',
      top: 26,
      left: 83,
      width: 15,
      height: 10
    }
  ] as WidgetInstance[]
};
