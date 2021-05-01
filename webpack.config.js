const { exec } = require("child_process");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");

const isWatch = process.argv.includes("--watch");
const mode = "development";

class SpawnPlugin {
  constructor(options = {}) {
    this.command = options.command || "";
    this.message = options.message || "Starting";
    this.name = "SpawnPlugin";
    this.compilerHook = "watchRun";
  }

  apply(compiler) {
    if (this.command) {
      compiler.hooks[this.compilerHook].tap(this.name, (c) => {
        c.hooks.afterEmit.tap(this.name, () => {
          if (!this.process) {
            console.log(this.message);
            this.process = exec(this.command);
            this.process.stdout.on("data", (data) => {
              console.log(data);
            });
            process.on("beforeExit", () => this.process.kill("SIGTERM"));
          }
        });
      });
    }
  }
}

if (isWatch) {
  console.log("watching...");
}

module.exports = [
  {
    mode,
    entry: {
      main: path.resolve(__dirname, "./src/backend/main.ts"),
    },
    target: "electron-main",
    devtool: false,
    cache: {
      type: "filesystem",
      cacheDirectory: path.resolve(__dirname, ".cache/webpack/backend"),
    },
    watchOptions: {
      poll: 1000,
    },
    output: {
      path: path.resolve(__dirname, "./dist/backend"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "src/image",
            to: "image",
          },
        ],
      }),
    ],
  },
  {
    mode,
    entry: {
      client: "./src/view/client.tsx",
    },
    cache: {
      type: "filesystem",
      cacheDirectory: path.resolve(__dirname, ".cache/webpack/frontend"),
    },
    target: "electron-renderer",
    devtool: false,
    watchOptions: {
      poll: 1000,
    },
    resolve: {
      extensions: [".js", ".json", ".ts", ".tsx"],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist/frontend"),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "src/view/main.html",
            to: "main.html",
          },
        ],
      }),
      new SpawnPlugin({ command: "yarn start", message: "Starting Electron" }),
    ],
  },
];
