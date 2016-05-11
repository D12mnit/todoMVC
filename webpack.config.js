var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/js/app.js',
        vender: ['react', 'react-dom']
    },
    output: {
        path: './dist',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            loader: 'babel'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vender','vender.js')
    ]
}
