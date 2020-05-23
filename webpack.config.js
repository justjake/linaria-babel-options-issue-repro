const pathlib = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

const html = `
		<!DOCTYPE html>
		<html lang="en" class="notion-html" data-accept-language="ACCEPT_LANGUAGE_VALUE">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
        <title>Linaria Demo</title>
				</head>
			<body>
				<div id="react-app"></div>
			</body>
		</html>
`;

const BROWSER_SUPPORT = [
  "Chrome >= 69",
  "last 2 Firefox versions",
  "last 2 Safari versions",
  "last 2 Edge versions",
  "electron >= 6.1.5",
  "iOS >= 11",
  "Android >= 69",
  "ChromeAndroid >= 69",
];

const babelOptions = {
  presets: [
    [
      // Polyfill magic.
      "@babel/preset-env",
      {
        corejs: 2,
        useBuiltIns: "usage",
        targets: {
          browsers: BROWSER_SUPPORT,
        },
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-react-inline-elements",
  ],
};

function rootPath(part) {
  return pathlib.join(__dirname, part);
}

const minify = false;
const offline = false;
const typecheck = false;

moduel.exports = {
  mode: minify ? "production" : "development",
  watch,
  entry: rootPath("src/client/main.ts"),
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    // Use content hashing for long term file caching when building for offline.
    filename: offline ? "app-[contenthash].js" : "app.js",
    path: rootPath("build/static"),
    chunkFilename: minify || offline ? "[name]-[contenthash].js" : "[name].js",
    pathinfo: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: babelOptions,
          },
          {
            loader: "ts-loader",
            options: {
              configFile: rootPath("tsconfig.client.json"),
              transpileOnly: typecheck === false,
            },
          },
          {
            loader: "linaria/loader",
          },
        ],
      },
      {
        // All other CSS is concatenated.
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: sourcemaps,
            },
          },
        ],
      },
    ],
  },
  devtool: sourcemaps ? "cheap-module-eval-source-map" : false,
  plugins: [
    // Compile CSS files.
    new MiniCssExtractPlugin({
      filename: offline ? "app-[contenthash].css" : "app.css",
      chunkFilename:
        minify || offline ? "[name]-[contenthash].css" : "[name].css",
    }),
    // Build the html files
    new HtmlWebpackPlugin({
      filename: offline ? "index-[md5:contenthash:hex:20].html" : "index.html",
      templateContent: html,
      minify: minify,
    }),
  ],
  // Additional optimizations when building for production.
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    ...(minify && {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // For some reason we still need this even though I'm on Safari 13!
            // Something to do with the way Safari handles `let` scopes.
            safari10: true,
            output: {
              comments: false,
            },
          },
        }),
      ],
    }),
  },
  node: {
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false,
    debug: false,
    crypto: false,
  },
};
