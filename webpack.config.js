const { spawn } = require('child_process');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const isWatch = process.argv.includes('--watch');
let app;
const mode = 'development';

if (isWatch) {
  console.log('watching...')
  // const main = path.resolve(__dirname, './dist/main.js');
  // spawn(`nodemon --watch ${main} ${main}`);
}

module.exports = [
  {
    mode,
    entry: {
      main: path.resolve(__dirname, './src/backend/main.ts')
    },
    target: 'electron-main',
    devtool: false,
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.cache/webpack/backend'),
    },
    watchOptions: {
      poll: 1000,
    },
    output: {
      path: path.resolve(__dirname, './dist/backend'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "src/image",
            to: "image"
          },
        ],
      }),
    ],
  },
  {
    mode,
    entry: {
      client: './src/view/client.tsx',
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.cache/webpack/frontend'),
    },
    target: 'electron-renderer',
    devtool: false,
    watchOptions: {
      poll: 1000,
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/frontend'),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "src/view/main.html",
            to: "main.html"
          },
        ],
      }),
    ],
  }
];
