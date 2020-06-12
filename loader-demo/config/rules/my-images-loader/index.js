let loaderUitls = require("loader-utils");
module.exports = function (source) {
  const options = loaderUitls.getOptions(this) || {};
  console.log(source);
  source = source.replace(/\https/g, options.replace);
  return source;
};
