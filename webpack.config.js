const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const ROOT = path.resolve(__dirname, "src")
const DESTINATION = path.resolve(__dirname, "dist")

module.exports = {
  context: ROOT,

  entry: {
    main: "./main.ts",
  },

  output: {
    filename: "shooter.min.js",
    path: DESTINATION,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      favicon: "Shooter/images/favicon.png",
    }),
  ],

  resolve: {
    extensions: [".ts", ".js"],
    modules: [ROOT, "node_modules"],
  },

  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: "pre",
        test: /\.js$/,
        use: "source-map-loader",
      },

      /****************
       * LOADERS
       *****************/
      {
        test: /\.ts$/i,
        exclude: [/node_modules/],
        use: "awesome-typescript-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(?:png|svg|jpg|ttf|gif)$/i,
        use: "file-loader",
      },
      {
        test: /\.html$/i,
        use: "html-loader",
      },
    ],
  },

  devtool: "cheap-module-source-map",
  devServer: {},
}
