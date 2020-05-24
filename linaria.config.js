// https://github.com/callstack/linaria/issues/447#issuecomment-620656902
const shaker = require("linaria/lib/babel/evaluators/shaker").default;
const extractor = require("linaria/lib/babel/evaluators/extractor").default;
const action = shaker;

const presetEnv = [
  "@babel/preset-env",
  {
    modules: false,
    targets: {
      node: "current",
    },
  },
];

const babelOptions = {
  presets: ["@babel/preset-react", "@babel/preset-typescript"],
  plugins: [
    /**
     * This babel configuration *should* allow the chroma-js import to work,
     * but, it doesn't because linaria specifies its own
     * plugin-transform-modules-commonjs, *without* `noInterop: true`
     */
    [
      "@babel/plugin-transform-modules-commonjs",
      { noInterop: true, JAKE: true },
    ],
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-react-inline-elements",
  ],
};

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
