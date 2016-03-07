var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');
var opn = require('opn');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
}).listen(3000, 'localhost', function (err, result) {
    if (err) {
    console.log(err);
    }
    opn('http://localhost:3000');
    console.log('Listening at localhost:3000');
});
