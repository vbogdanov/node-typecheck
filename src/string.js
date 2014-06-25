'use strict';

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
  return function (exports) {
    var string = exports.create(function (value) {
      return typeof value === 'string';
    });

    string.notEmpty = function () {
      return this.subtype(function (value) {
        return value !== '';
      });
    };

    exports.string = string;
  };
});
