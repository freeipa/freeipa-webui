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
    publicPath: "/",
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
    historyApiFallback: true,

    proxy: {
      "/ipa/session/json": {
        target: "https://svcgv.freeipa.cn",
        secure: false,
        changeOrigin: true,
        onProxyReq: (proxyReq) => {
          const host  = "example.server.ipa.demo"
          proxyReq.setHeader("origin", `https://${host}/ipa/ui/`);
          proxyReq.setHeader("referer", `https://${host}/ipa/ui/`);
          proxyReq.setHeader("host", host);
          proxyReq.setHeader(
            "cookie",
            "ipa_session=MagBearerToken=SaLCj1ZS5ehNgdCxOM7PP8Og%2f9NkZkiCF0YkbhpVxUyM1J0hkVoLPURpHVKZ%2b%2fa77weGp5%2frLml6NcrJj8yUYI2MVp7zClE20vFqO%2fFsOS9pUNxoyvpubnjyrSlmHb9dHQojhk0WOKXsPNCn0Ju0PytGo%2fbKRhMyPHvaaLNDSMRDf%2fHcgAbnshhRPAUgCFgB"
          );
          proxyReq.setHeader("Cache-Control", "no-cache");
          proxyReq.setHeader("content-type", "application/json");
          proxyReq.setHeader("connection", "keep-alive");
          proxyReq.setHeader("accept", "*/*");
          proxyReq.setHeader("accept-encoding", "gzip, deflate, br");

          proxyReq.removeHeader("accept-language");
          proxyReq.removeHeader("sec-fetch-dest");
          proxyReq.removeHeader("sec-ch-ua-mobile");
          proxyReq.removeHeader("sec-ch-ua-platform");
          proxyReq.removeHeader("sec-ch-ua");
        },
      },
    },
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
