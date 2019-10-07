const path = require('path');
const webpack = require("webpack");
const CopyPlugin = require('copy-webpack-plugin');

// use smaller sql-wasm.wasm
// https://github.com/Taytay/sql.js/blob/b5f3c25d378c1e26df1276afe3208979c3eb0a96/dist/sql-wasm.wasm

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'emporium.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'emporium',
        libraryTarget: 'umd'
    },
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    },
    module: {
        rules: [
            { parser: { System: false } },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
            result.request = result.request.replace(/typeorm/, "typeorm/browser");
        }),
        new CopyPlugin([
            { from: 'node_modules/sql.js/dist/sql-wasm.wasm' }
        ]),
    ],
    resolve: {
        modules: [
            __dirname,
            'node_modules',
        ],
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'source-map',
    externals: [
        /^rxjs$/
    ],
};