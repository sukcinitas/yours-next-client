const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './src/main.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  devServer: {
      historyApiFallback: {
        rewrites: [
          {
            from: /.*/,
            to: path.posix.join('', 'index.html'),
          },
        ],
      },
      hot: true,
      compress: true,
      host: 'localhost',
      port: 8080,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
        },
      },
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.js",
    },
    extensions: ["*", ".js", ".vue", ".json"],
  },
}