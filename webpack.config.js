import webpack from "webpack";

const RELEASE = true;

export default {
  entry: {
    icu4x_bidi: './icu4x_bidi.js',
  },
  output: {
    library: 'ICU4XBidiPromise',
    // To preserve the original name of the wasm file.
    assetModuleFilename: '[name][ext]',
  },
  mode: "production",
  experiments: {
    topLevelAwait: true,
  },
  optimization: {
    minimize: RELEASE,
    mangleWasmImports: RELEASE,
    mangleExports: RELEASE ? "size" : false,
  },
  plugins: [
    new webpack.DefinePlugin({
      // To tree-shake the node code path.
      'typeof fetch': JSON.stringify('function'),
    }),
  ],
};
