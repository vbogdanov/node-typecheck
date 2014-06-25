'use strict';

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./array','./string','./number', './function'], function ($array, $string, $number, $function) {

  var exports = {};

  exports = function (isFn) {
    this.is = isFn;
  };

  exports.create = function (isFn) {
    return new exports(isFn);
  };

  exports.prototype = {
    subtype: function (isFn) {
      var self = this;
      var nt = Object.create(self);
      nt.is = function (value) {
        return self.is(value) && isFn(value);
      };
      return nt;
    },
    is: function (value) {
      //type prototype is supertype for all
      return true;
    },
    assert: function (value) {
      if (!this.is(value)) {
        //TODO: detailed description of value
        throw new Error('Unexpected Type of value' + value);
      }
    },
    and: function (type) {
      var self = this;
      return exports.create(function (value) {
        return self.is(value) && type.is(value);
      });
    },
    or: function (type) {
      var self = this;
      return exports.create(function (value) {
        return self.is(value) || type.is(value);
      });
    },
    optional: function () {
      var self = this;
      return exports.create(function (value) {
        return typeof value === 'undefined' || self.is(value);
      });
    }
  };

  exports.hashType = function (hash) {
    return exports.create(function (value) {
      for (var k in hash) {
        if (!hash[k].is(value[k])) return false;
      }
      return true;
    });
  };

  exports.tupleType = function (array) {
    return exports.create(function (value) {
      if (array.length < value.length)
        return false;
      for(var i = 0; i < array.length; i ++) {
        if (!array[i].is(value[i]))
          return false;
      }
      return true;
    });
  };
  //base types
  $array(exports);
  $string(exports);
  $number(exports);
  $function(exports);
  // Type type
  exports.Type = exports.hashType({
    is: exports.fn,
    assert: exports.fn,
    subtype: exports.fn,
    and: exports.fn,
    or: exports.fn,
    optional: exports.fn
  });
  // undefined type
  exports.undef = exports.create(function (value) {
    return typeof value === 'undefined';
  });

  exports.void = exports.undef;
  // null type
  exports.null = exports.create(function (value) {
    return value === null;
  });
  // null or undefined type
  exports.none = exports.create(function (value) {
    return value == undefined;
  });
  
  return exports;
});
