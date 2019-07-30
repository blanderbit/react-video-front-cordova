const path = require('path');
const { setLoader, setPlugin } = require('webpacker/utils');
const constants = require(`./config/${process.env.NODE_ENV || 'development'}`);
const scssVariables = path.resolve(__dirname, './src/scss/_variables.scss');

module.exports = {
  output: fn => fn({
    path: path.join(__dirname, 'build'),
    publicPath: '/',
  }),
  preset: {
    loaders: [
      setLoader('react'),
      setLoader('css', { postcssOpts: require('autoprefixer') }),
      setLoader('scss', { scssVariables, postcssOpts: require('autoprefixer') }),
    ],
    plugins: [
      setPlugin('configure', {constants}),
      setPlugin('css'),
      setPlugin('html'),
    ],
  }
};