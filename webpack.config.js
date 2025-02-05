const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: process.env.PUBLIC_PATH || '/', // Use environment variable or fallback to '/'
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
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
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
            filename: 'styles.css',
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
    mode: process.env.NODE_ENV || 'development', // Use environment variable or fallback to 'development'
};