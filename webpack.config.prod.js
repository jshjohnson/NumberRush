var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'false',
  entry: [
    './assets/scripts/src/index'
  ],
  output: {
    path: path.join(__dirname, '/assets/scripts/dist'),
    filename: 'bundle.min.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: false,
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
