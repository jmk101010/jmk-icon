module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    { name: 'removeAttrs', params: { attrs: '(fill|stroke|width|height|data-name|xmlns)' } },
  ],
};
