Reproduces https://github.com/callstack/linaria/issues/612

My project is a large Typescript codebase that does not use --esModuleInterop.
That means that in our source files, the import syntax for a commonjs module
with a single export is `import * as singleExport from 'module-name'`.
The babel equivalent of that `import` configuration is to use
`["@babel/plugin-transform-modules-commonjs", { noInterop: true }]`.

However, Linaria always forces that babel plugin, but with the default options:
`noInterop: false`. When our code is pre-processed with
`@babel/plugin-transform-modules-commonjs`, the result of the import statement
is now some unexpected value, instead of the `chroma` function.

## Instructions

1. `npm install`
2. `./node_modules/.bin/webpack`

You can modify [./src/client/main.tsx](./src/client/main.tsx) to enable or
disable the error to verify that `chroma` "works" during normal script
execution.

Check out also linaria.config.js for some other explanation.
