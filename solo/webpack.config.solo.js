const base = require('../bridge/webpack.config');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

base.entry = path.resolve(__dirname, '../src/index.ts');

base.plugins = [
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['build/emporium']
    }),
    new HTMLWebpackPlugin({
        // Use this template to get basic responsive meta tags
        template: path.resolve(__dirname, 'index.html'),
        // inject details of output file at end of body
        inject: false
    })
];

base.optimization = {
    namedModules: true
};

module.exports = base;