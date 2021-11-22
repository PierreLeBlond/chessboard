const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

const config = require(`./${process.env.NODE_ENV}.config`);

module.exports = {
  mode: config.mode,

  entry: './src/main.ts',

  module: {
    rules: [
      {
        test: /\.(ts)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(gltf)$/i,
        type: 'asset/resource'
      }
    ],
  },

  resolve: {
    extensions: ['*', '.ts', '.js']
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public", to: "./" },
      ],
    }),
  ],

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config.publicPath,
    filename: 'main.js',
    assetModuleFilename: `assets/${config.mediaFilename}`,
    chunkFilename : `chunks/${config.chunkFilename}`,
    clean: true
  },

  devtool: config.devtool,
  devServer: config.devServer,
};

