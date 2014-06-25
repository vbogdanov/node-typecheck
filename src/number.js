'use strict';

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
  return function (exports) {
    var number = exports.create(function (value) {
      return typeof value === 'number' && !isNaN(value);
    });

    number.not0 = function () {
      return this.subtype(function (value) {
        return value !== 0;
      });
    };

    number.finite = function () {
      return this.subtype(function (value) {
        return isFinite(value);
      });
    };

    number.integer = function () {
      return this.subtype(function (value) {
        return value % 1 === 0;
      });
    };

    number.lt =  function (upperBound) {
      number.assert(upperBound);
      return this.subtype(function (value) {
        return value < upperBound;
      });
    };

    number.lteq =  function (upperBound) {
      number.assert(upperBound);
      return this.subtype(function (value) {
        return value <= upperBound;
      });
    };

    number.gt =  function (lowerBound) {
      number.assert(lowerBound);
      return this.subtype(function (value) {
        return value > lowerBound;
      });
    };

    number.gteq =  function (lowerBound) {
      number.assert(lowerBound);
      return this.subtype(function (value) {
        return value >= lowerBound;
      });
    };

    number.bounds = function (lowerBound, upperBound) {
      number.assert(lowerBound);
      number.assert(upperBound);
      return this.subtype(function (value) {
        return lowerBound <= value && value < upperBound;
      });
    };

    exports.number = number;
  };
});
