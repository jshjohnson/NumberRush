var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [
        './assets/scripts/src/index'
    ],
    output: {
        path: path.join(__dirname, '/assets/scripts/dist'),
        filename: 'bundle.js',
        publicPath: '/assets/scripts/dist/'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: true,
            output: {
                comments: false
            },
            compress: {
                warnings: false,
                screw_ie8: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loaders: ['babel'],
            include: path.join(__dirname, 'assets/scripts/src')
        }]
    }
};