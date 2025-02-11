const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: isProduction ? '/memory-game/' : '/', // Adjust for GitHub Pages
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../', // Fix for relative paths in CSS
                        },
                    },
                    {
                        loader: 'css-loader', // Translates CSS into CommonJS
                        options: {
                            url: false, // Disable URL transformation
                        },
                    },
                    'sass-loader', // Compiles SCSS to CSS
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]', // Ensure images are copied to the correct folder
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]', // Ensure fonts are copied to the correct folder
                },
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'images', // Copy everything inside the `images` folder
                    to: 'images',   // Preserve the folder structure in `dist`
                    noErrorOnMissing: true, // Ignore if the folder is missing
                },
                {
                    from: 'fonts',
                    to: 'fonts',
                },
                {
                    from: 'index.html',
                    to: 'index.html',
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css', // Output CSS file name
        }),
    ],
    optimization: {
        minimize: isProduction, // Enable minimization only in production
        minimizer: [
            `...`, // Preserve the default JS minimizer (Terser)
            new CssMinimizerPlugin(), // Use cssnano for CSS minification
        ],
    },
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
    mode: isProduction ? 'production' : 'development',
};