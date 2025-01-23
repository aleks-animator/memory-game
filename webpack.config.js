const path = require('path');  // Import the path module
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    mode: isDevelopment ? 'development' : 'production', // Explicitly set mode

    entry: './main.js',
    output: {
      filename: isDevelopment ? 'bundle.js' : 'bundle-[contenthash].js',
      path: path.resolve(__dirname, 'docs'),
      clean: true,
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
      new HtmlWebpackPlugin({
        template: './index.html',
        minify: isDevelopment ? false : { 
          removeComments: true,
          collapseWhitespace: true,
        },
      }),
      new CopyPlugin({
        patterns: [
          { from: 'images', to: 'images' },
        ],
      }),
    ],
    devServer: isDevelopment
      ? {
          static: path.resolve(__dirname, 'docs'),
          compress: true,
          port: 9000,
          historyApiFallback: true,
        }
      : {},
  };
};
