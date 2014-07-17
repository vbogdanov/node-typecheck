'use strict';

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
  return function (exports) {
    var regexp = exports.create(function (value) {
      return value instanceof RegExp;
    });

    exports.regexp = regexp;
  };
});
