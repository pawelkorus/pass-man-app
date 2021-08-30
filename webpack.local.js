const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      host: '0.0.0.0',
      contentBase: [path.resolve(__dirname, 'target'), path.resolve(__dirname, '.config-local')]
    }
});
