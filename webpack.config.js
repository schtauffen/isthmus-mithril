const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/umd',
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    mainFields: [
      'module',
      'main'
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
