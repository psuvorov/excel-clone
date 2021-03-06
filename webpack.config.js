const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[fullhash].${ext}`;

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: ["./main.ts"],
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            // "@": path.resolve(__dirname, "src"),
            // "@core": path.resolve(__dirname, "src/core")
        }
    },
    target: "web",
    devtool: isDev ? "source-map" : false,
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        port: 3000,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: "index.html",
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, "src/favicon.png"), to: path.resolve(__dirname, "dist")}
            ],
            options: {
                concurrency: 100,
            },
        }),
        new MiniCssExtractPlugin({
            filename: filename("css")
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    "css-loader",
                    "sass-loader",
                ], 
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    }
};
