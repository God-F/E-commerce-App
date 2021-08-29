const px2rem = require('postcss-px2rem');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/E-App/'
    : '/',
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          px2rem({
            remUnit: 37.5,
          }),
        ],
      },
    },
  },
};
