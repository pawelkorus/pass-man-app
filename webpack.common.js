const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
    entry: {
      'index': './src/index.tsx',
      'login': './src/login.tsx'
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css)/,
                use: [ 
                  MiniCssExtractPlugin.loader, // instead of style-loader
                  {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                  }]
            },
            {
                test: /\.(scss)/,
                use: [
                  MiniCssExtractPlugin.loader, 
                  {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                  }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                  }
                ]
            },
            {
              test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
              type: 'asset/resource',
              generator: {
                filename: 'fonts/[hash][ext][query]'
              }
            },
            {
              test: /\.(csv)$/,
              type: 'asset/resource'
            },
            {
              test: /\.(png)$/,
              type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.scss' ],
        fallback: {
          'http': false,
          'crypto': false,
          'fs': false,
          'path': false,
          'os': false,
          'stream': false,
          'buffer': false
        }
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'target')
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          inlineSource: '.(js|css)$', // embed all javascript and css inline
          chunks: ['index'],
          template: 'src/index.html',
          filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
          inlineSource: '.(js|css)$', // embed all javascript and css inline
          template: 'src/index.html',
          chunks: ['login'],
          filename: 'login.html'
        })
    ]
};
