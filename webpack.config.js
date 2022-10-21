const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  entry: {
    app: ["./src/index.tsx"],
    vendor: ["react", "react-dom"],
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: "js/[name].bundle.js",
  },

  devtool: "source-map",

  watchOptions: {
    aggregateTimeout: 600,
    poll: 1000,
  },

  devServer: {
    watchFiles: ["src/**/*", "public/**/*"],
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    liveReload: true,
    port: 3000,
  },

  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    plugins: [new TsconfigPathsPlugin()],
  },

  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),
  ],

  module: {
    rules: [
      { test: /\.(ts|tsx)$/, loader: "ts-loader" },
      { test: /\.js$/, enforce: "pre", loader: "source-map-loader" },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
