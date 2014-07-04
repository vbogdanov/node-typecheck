/* jshint globalstrict: true */
/* global require: false */
/* global describe: false */
/* global it: false */
/* global expect: false */
/* global process: false */
/* global console: false */
/* jshint maxstatements: 30 */
'use strict';

var T = require('../src/typecheck.js');

describe('constraints', function () {

  it('is a constructor function and namespace containing certain properties and functions', function () {
    expect(typeof T).toEqual('function');
    expect(T.create).toEqual(jasmine.any(Function));
    expect(T.prototype).toEqual(jasmine.any(Object));
    expect(T.hashType).toEqual(jasmine.any(Function));
    expect(T.tupleType).toEqual(jasmine.any(Function));
    expect(T.array).toEqual(jasmine.any(T));
    expect(T.number).toEqual(jasmine.any(T));
    expect(T.string).toEqual(jasmine.any(T));
    expect(T.fn).toEqual(jasmine.any(T));
    expect(T.undef).toEqual(jasmine.any(T));
    expect(T.null).toEqual(jasmine.any(T));
    expect(T.none).toEqual(jasmine.any(T));
    expect(T.void).toBe(T.undef);
  });

  describe('instance', function () {
    it('creates new type object with the given check function', function () {
      var MyType = new T(function (value) {
        return value === 5;
      });
      expect(MyType).toEqual(jasmine.any(T));
      expect(MyType.is(5)).toBe(true);
    });
  });

  describe('hashType', function () {
    var MyType = T.hashType({
      name: T.string.notEmpty(),
      age:T.number.bounds(0, 130)
    });
    
    expect(MyType).toEqual(jasmine.any(T));
    
    expect(MyType.is({
      name: 'Peter',
      age: 20
    })).toBe(true);

    expect(MyType.is({
      name: '',
      age: 20
    })).toBe(false);

    expect(MyType.is({
      name: 'Peter',
      age: 20,
      bla:''
    })).toBe(true);

    expect(MyType.is({
      name: 'Peter',
      age: -1
    })).toBe(false);

    expect(MyType.is({
      name: 'Peter',
      age: 130
    })).toBe(false);

  });

  describe('tupleType', function () {
    var snf = T.tupleType([T.string, T.number, T.fn]);
    expect(snf).toEqual(jasmine.any(T));

    expect(snf.is([])).toBe(false);
    expect(snf.is(['',0,function () {}])).toBe(true);
    expect(snf.is([0, ''])).toBe(false);

    var snf2 = T.tupleType([T.string, T.number.optional()]);
    expect(snf2.is(['', 0])).toBe(true);
    expect(snf2.is([''])).toBe(true);
    expect(snf2.is([])).toBe(false);
  });

  describe('nones:', function () {
    var a, b = 5, c = null;

    it('undefined', function () {
      expect(T.undef.is(a)).toBe(true);
      expect(T.undef.is(b)).toBe(false);
      expect(T.undef.is(c)).toBe(false);
    })
    
    it('null', function () {
      expect(T.null.is(a)).toBe(false);
      expect(T.null.is(b)).toBe(false);
      expect(T.null.is(c)).toBe(true);
    });
    
    it('null or undefined', function () {
      expect(T.none.is(a)).toBe(true);
      expect(T.none.is(b)).toBe(false);
      expect(T.none.is(c)).toBe(true);
    });
  });

});
