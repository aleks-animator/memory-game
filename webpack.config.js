const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[path][name][ext]',
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'images', to: 'images' },
        { from: 'index.html', to: 'index.html' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.css'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
  },
  mode: 'development',
};
