const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    output: {
      path: __dirname + '/docs'
    },
    // Merged into the final Webpack config
    plugins: [
      new CopyWebpackPlugin([{
        from: "public"
      }])
    ]
  }
};
