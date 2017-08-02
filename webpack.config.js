const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/umd',
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/public/',
    libraryTarget: 'umd',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
