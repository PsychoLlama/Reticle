var webpack = require("webpack");

module.exports = {

  entry: "./index.js",
  output: {
    path: "./",
    filename: "reticle.min.js"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    }),
		new webpack.IgnorePlugin(/^gun/)
  ]
};
