const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
                test: /\.scss$/i, // Handle .scss files
                use: [
                    MiniCssExtractPlugin.loader, // Extract CSS into separate files
                    'css-loader', // Translates CSS into CommonJS
                    'sass-loader', // Compiles SCSS to CSS
                ],
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
        new MiniCssExtractPlugin({
            filename: 'styles.css', // Output CSS file name
        }),
    ],
    resolve: {
        extensions: ['.js', '.css', '.scss'],
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