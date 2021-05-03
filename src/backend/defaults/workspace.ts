import path from "path";
import { WorkspaceState } from "@app-types";

const toLocalUri = (local: string) => `file://${path.resolve(process.cwd(), local).replace(/\\/g, "/")}`;

// const namespace = "464df167-f251-47f8-a784-48c675a514df";
// console.log(v5("examples/system.html", namespace));

export default {
  widgetScripts: {
    "448c0367-6847-5122-9862-e21c17b5cd40": {
      name: "clock",
      uri: toLocalUri("examples/clock.html"),
    },
    "8fccec6e-e0d4-5d3c-b2b5-2e9806936959": {
      name: "system",
      uri: toLocalUri("examples/system.html"),
    },
  },
  widgetInstances: [
    {
      alias: "8fccec6e-e0d4-5d3c-b2b5-2e9806936959",
      id: "9b9ed5a5-d673-4c85-9cd0-2b3a36656098",
      top: 2,
      left: 83,
      width: 15,
      height: 20,
    },
    {
      alias: "448c0367-6847-5122-9862-e21c17b5cd40",
      id: "49e9c5b4-900a-4cf7-8f9e-310e34a94cf1",
      top: 24,
      left: 83,
      width: 15,
      height: 20,
    },
  ],
} as WorkspaceState;
