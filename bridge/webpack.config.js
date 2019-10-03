const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'emporium.js',
        path: path.resolve(__dirname, 'build/emporium'),
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
    resolve: {
        modules: [
            __dirname,
            'node_modules',
        ],
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devtool: 'source-map',
    externals: [
        /^rxjs$/
    ],
};