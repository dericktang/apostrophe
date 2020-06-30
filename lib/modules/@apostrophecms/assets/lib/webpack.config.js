const path = require('path');

const merge = require('webpack-merge');

const scss = require('./webpack.scss');
const vue = require('./webpack.vue');

module.exports = ({ importFile, modulesDir }, apos) => {
  const tasks = [scss, vue].map(task =>
    task(
      {
        importFile,
        modulesDir
      },
      apos
    )
  );

  const config = {
    entry: importFile,
    mode: 'development',
    optimization: { minimize: false },
    devtool: 'eval-source-map',
    output: {
      path: `${apos.rootDir}/public/apos-frontend`,
      filename: 'user-only-bundle.js'
    },
    // we could extend this with aliases for other apostrophe modules
    // at a later date if needed
    resolveLoader: {
      extensions: ['*', '.js', '.vue', '.json'],
      modules: ['node_modules/apostrophe/node_modules', 'node_modules']
    },
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
      alias: {
        'apostrophe/vue$': 'vue/dist/vue.esm.js',
        // resolve apostrophe modules, with overrides
        apostrophe: path.resolve(modulesDir)
      },
      modules: [
        // TODO change this if we decide to namespace the
        // apostrophe module itself
        `${apos.rootDir}/node_modules/apostrophe/node_modules`,
        `${apos.rootDir}/node_modules`
      ]
    },
    stats: 'verbose'
  };

  return merge.smart(config, ...tasks);
};