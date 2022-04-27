const path = require('path');

module.exports = {
  entry: {
    app01: './App/app01.ts',
    app02: './App/app02.ts',
    app03: './App/app03.ts',
    app04: './App/app04.ts',
    app05: './App/app05.ts',
    app06: './App/app06.ts',
    app07: './App/app07.ts',
    app08: './App/app08.ts',
  },
  output: {
    path: path.resolve(__dirname, 'wwwroot/js'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      { test: /\.(ts)$/, loader: 'ts-loader' }
    ],
  },
  mode: "development",
  devtool: 'source-map'
};
