module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  env: {
    browser: false,
    node: true,
    jest: true
  },
  globals: {
    Promise: 'readonly'
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'eol-last': ['error', 'always'],
    'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 2 }],
    'no-unreachable': 'error',
    complexity: ['error', 10],
    'default-case': 'error',
    eqeqeq: 'error',
    'no-else-return': 'error',
    'require-await': 'error',
    yoda: 'error',
    camelcase: 0,
    'no-async-promise-executor': 0,
    'array-bracket-newline': 'warn',
    'array-bracket-spacing': 'warn',
    'no-explicit-any': 0
  }
};
