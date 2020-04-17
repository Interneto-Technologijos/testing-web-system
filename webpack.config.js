const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'app', 'src', 'index.jsx'),
  output: {
    path: path.join(__dirname, 'app', 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        resolve: { extensions: ['.js', '.jsx'] },
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env', 'react'],
          },
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join('.', 'app', 'src', 'index.html'),
    inject: false,
  })],
};
