import webpack from "webpack";

const RELEASE = true;

export default {
  entry: {
    icu_capi_skiawasm: './icu_capi_skiawasm.js',
  },
  output: {
    library: 'ICU4XPromise',
    // To preserve the original name of the wasm file.
    assetModuleFilename: '[name][ext]',
  },
  mode: RELEASE ? "production" : "development",
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
