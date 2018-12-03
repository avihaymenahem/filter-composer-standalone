const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackDefBuilder = require('webpack-plugin-def-builder');
;
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        // vendor: ['angular'],
        app:'./app/index.js'
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'assets/js/[name].[hash].js',
        chunkFilename: 'assets/js/[name].[hash].js'
    },
    devtool: "cheap-eval-source-map",
    module: {
        rules: [
            {
                test: /\.js$/, // which file needs to be read
                exclude: /node_modules/, // which folder needs not to be read
                loader: ['babel-loader'] // which transplier/compiler/plugin to compile files
            },
            {
                test: /\.ts$/,
                loader : 'ts-loader'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    ignoreCustomFragments: [/<!--\/?webpack-ignore-->/g]
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico)$/,
                loader: 'file-loader',
                query: {
                    name: "assets/imgs/[hash].[name].[ext]"
                }
            },
            {
                test: /\.svg/, loader: 'svg-url-loader',
                options: { encoding: 'base64' }
            },
            {
                test: /\.(woff|woff2|ttf|eot)/,
                loader: 'file-loader',
                query: {
                    name: "assets/fonts/[hash].[name].[ext]"
                }
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false
            }
        },
        runtimeChunk: false
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //         cacheGroups: {
    //             styles: {
    //                 name: 'styles',
    //                 test: /\.css$/,
    //                 chunks: 'all',
    //                 enforce: true
    //             }
    //         }
    //     }
    // },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: 'index.html'
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "assets/[name].css",
        }),
        new webpackDefBuilder({
            basePath: '/'
        })
    ],
    stats: {
        modules: false,
        cached: false,
        colors: true
    },
    devServer: {
        port: 8000,
        contentBase: './',
        watchContentBase: true,
    }
};