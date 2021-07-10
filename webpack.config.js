const path = require('path');
const webpack = require('webpack');
const glob = require('glob');


let globOptions = {
    ignore: ['node_modules/**', 'venv/**']
}

let entryFiles = glob.sync("sscs/**/javascript/**/*.js", globOptions)

let entryObj = {};
entryFiles.forEach(function(file){
    if (file.includes('.')) {
        let parts = file.split('/')
        let path = parts.pop()
        let fileName = path.split('.')[0];
        entryObj[fileName] = `./${file}`;
    }
});

const config = {
    mode: process.env.NODE_ENV,
    entry: entryObj,
    output: {
        path: path.resolve(__dirname, 'sscs/static/js'),
        publicPath: "/static/",
        filename: '[name].js',
        chunkFilename: "[id]-[chunkhash].js",
        sourceMapFilename: "[name].js.map",
    },
    devtool: "source-map",
    optimization: {
        minimize: false
    }
}

module.exports = config
