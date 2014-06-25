'use strict';

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
  return function (exports) {
    var array = exports.create(function (value) {
      return !!value && value.constructor === Array;
    });

    array.notEmpty = function () {
      return this.subtype(function (value) {
        return value.length > 0;
      });
    };

    array.size = function (size) {
      //TODO: confirm size is Number
      return this.subtype(function (value) {
        return value.length === size;
      });
    };

    array.typed = function (type) {
      //TODO: confirm type is Type
      return this.subtype(function (value) {
        for (var i = 0; i < value.length; i ++) {
          if (!type.is(value[i]))
            return false;
        }
        return true;
      });
    };

    exports.array = array;
  };
});
