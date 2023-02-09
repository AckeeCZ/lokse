/**
 * Custom resolver resolves ability to mock require.resolve
 * https://github.com/facebook/jest/issues/9543#issuecomment-616358056
 */
// eslint-disable-next-line node/no-unpublished-require
const glob = require("glob");
const path = require("path");

let mapping = {};

const globPattern = path.join(
  __dirname,
  "../packages/*/src/**/__tests__/modules-resolution.json"
);

// Looks for "module-resolution.json" files in all the `__tests__` directories
glob
  .sync(globPattern)
  // eslint-disable-next-line unicorn/no-array-for-each
  .forEach((file) => {
    // For each of them, merges them in the "mapping" object
    mapping = { ...mapping, ...require(file) };
  });

function resolver(path, options) {
  // console.log(path, mapping);
  // If the path corresponds to a key in the mapping object, returns the fakely resolved path
  // otherwise it calls the Jest's default resolver
  return mapping[path] || options.defaultResolver(path, options);
}

module.exports = resolver;
