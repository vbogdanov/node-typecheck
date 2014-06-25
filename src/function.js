'use strict';

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
  return function (exports) {
    var fn = exports.create(function (value) {
      return typeof value === 'function';
    });

    fn.safe = function (/* returnType, args..., originalFunction */) {
      var returnType, argsArr, originalFunction, argTuple;
      returnType = arguments[0];
      argsArr = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
      originalFunction = arguments[arguments.length - 1];

      argTuple = exports.tupleType(argsArr); 
      return function () {
        argTuple.assert(arguments);
        var result = originalFunction.apply(this, arguments);
        returnType.assert(result);
        return result;
      };
    };

    exports.fn = fn;
  };
});
