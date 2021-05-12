import { Config } from "vega-lite-dev-config";

const config: Config = {
  module: 'vega-lite-dev-config',
  drivers: ["eslint", "prettier"],
  // optional settings for the vega-lite-dev-config
  settings: {
    node: true,
    react: false,
  }
};

export default config;
