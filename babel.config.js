module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  env: {
    test: {
      presets: [['@babel/preset-env']]
    }
  }
};
