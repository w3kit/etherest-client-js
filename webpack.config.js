var webpack = require('webpack');
var path = require('path');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var libraryName = 'Etherest';
var outputFile = 'etherest.min.js';

var config = {
  entry: __dirname + '/lib/etherest.js',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components|dist)/
      }
    ]
  },
  plugins: [
  	new UglifyJsPlugin({ minimize: true })
  ]
}

module.exports = config;