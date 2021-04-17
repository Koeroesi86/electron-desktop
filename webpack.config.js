const { spawn } = require("child_process");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");

const isWatch = process.argv.includes("--watch");
const mode = "development";

class SpawnPlugin {
  constructor(options = {}) {
    this.main = options.command || "";
    this.message = options.message || "Starting";
    this.name = "SpawnPlugin";
  }

  apply(compiler) {
    if (this.main) {
      const command = this.main.split(" ");
      compiler.hooks.watchRun.tap(this.name, (c) => {
        c.hooks.afterEmit.tap(this.name, () => {
          if (!this.process) {
            console.log(this.message);
            this.process = spawn(command[0], command.slice(1), { shell: true, stdio: "inherit" });
            process.on("beforeExit", () => this.process.kill(0));
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
