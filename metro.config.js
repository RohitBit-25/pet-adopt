/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(path.resolve(__dirname));

config.transformer.unstable_allowRequireContext = true;

module.exports = config;
