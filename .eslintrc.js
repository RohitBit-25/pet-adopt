// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react"],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
    detox: true,
  },
  globals: {
    module: "writable",
    FormData: "readonly",
    __dirname: "readonly",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "off",
  },
};
