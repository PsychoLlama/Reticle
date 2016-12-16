'use strict';

const eslint = exports;

eslint.env = {
  browser: true,
  node: true,
  es6: true,
  commonjs: true,
};

eslint.extends = [
  'eslint:recommended',
  'llama',
];

eslint.rules = {
  'global-require': 'off',
};
