module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@lang': './lang/Lang',
            '@components': './components',
            '@img': './img',
            '@analytics': './analytics',
          },
        },
      ],
    ],
  };
};