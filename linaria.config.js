// https://github.com/callstack/linaria/issues/447#issuecomment-620656902
const shaker = require("linaria/lib/babel/evaluators/shaker").default;
const extractor = require("linaria/lib/babel/evaluators/extractor").default;
const action = extractor;

const presetEnv = [
  "@babel/preset-env",
  {
    modules: false,
    targets: {
      node: "current",
    },
  },
];

const babelOptions = require("./babel.config.json");
if (action !== shaker) {
  // The shaker unshifts its own copy of preset-env, which will blow
  // up we we give one, too.
  babelOptions.presets.unshift(presetEnv);
}

const config = {
  sourceMap: true,
  cacheDirector: "build/linaria-cache",
  babelOptions: babelOptions,
  rules: [
    {
      action: action,
    },
    {
      test: /\/node_modules\//,
      action: "ignore",
    },
  ],
  sourceMap: true,
};

module.exports = config;
