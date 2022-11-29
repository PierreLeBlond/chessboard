const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const config = require(`./${process.env.NODE_ENV}.config`);

const common = {
  mode: config.mode,
  module: {
    rules: [
      { test: /\.(ts)$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.(gltf|hdr)$/i, type: 'asset/resource' }
    ],
  },
  resolve: { extensions: ['*', '.ts', '.js'] },
}

const library = {
  ...common,
  entry: './src/index.ts',

  output: {
    path: path.resolve(__dirname, '../dist/lib'),
    publicPath: config.publicPath,
    filename: 'index.js',
    library: {
      type: "module"
    },
    assetModuleFilename: `assets/${config.mediaFilename}`,
    chunkFilename: `chunks/${config.chunkFilename}`,
    clean: true
  },
  experiments: {
    outputModule: true
  },
  externalsType: 'var',
  externals: {
    '@s0rt/3d-viewer': 'VIEWER'
  }
};

const iife = {
  ...common,
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config.publicPath,
    filename: 'main.js',
    assetModuleFilename: `assets/${config.mediaFilename}`,
    chunkFilename: `chunks/${config.chunkFilename}`
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: './' },
      ],
    }),
  ],
  devtool: config.devtool,
  devServer: config.devServer,
}

module.exports = [library, iife];

