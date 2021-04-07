const { BABEL_ENV } = process.env;
const cjs = BABEL_ENV === 'commonjs';
const loose = true;

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        corejs: {
          version: 3,
          proposals: true,
        },
        useBuiltIns: 'entry'
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/proposal-object-rest-spread', { loose }],
    cjs && ['@babel/transform-modules-commonjs', { loose }],
    ['@babel/transform-runtime', { useESModules: !cjs }]
  ].filter(Boolean),
  comments: false,
};
