var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: {
        app: './src/js/app.js',
        vender: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname,"dist"),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            loader: 'babel'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vender','vender.js'),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom'
        })
    ]
}
