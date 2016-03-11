var webpack = require('karma-webpack');

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            '../node_modules/phantomjs-polyfill/bind-polyfill.js',
            '../tests/**/*_spec.js',
            { pattern: '../assets/audio/**', watched: false, included: false, served: true }
        ],
        plugins: [webpack, 'karma-jasmine', 'karma-chrome-launcher', 'karma-coverage', 'karma-spec-reporter'],
        browsers: ['Chrome'],
        preprocessors: {
            '**/*_spec.js': ['webpack'],
            'src/**/*.js': ['webpack']
        },
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            dir: '../tests/reports/coverage',
            reporters: [{
                type: 'html',
                subdir: 'report-html'
            }]
        },
        webpack: {
            module: {
                loaders: [{
                    test: /\.(js|jsx)$/,
                    exclude: /(bower_components|node_modules)/,
                    loader: 'babel-loader'
                }],
                postLoaders: [{
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components|tests)/,
                    loader: 'istanbul-instrumenter'
                }]
            }
        },
        colors: true,
        webpackMiddleware: {
            noInfo: true
        },
        proxies: {
            '/assets/audio/beep.mp3': '../assets/audio/beep.mp3',
            '/assets/audio/success.mp3': '../assets/audio/success.mp3',
            '/assets/audio/incorrect.mp3': '../assets/audio/incorrect.mp3'
        }
    });
};