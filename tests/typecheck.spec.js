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

      expect(MyType.is(5)).toBe(true);
    });
  });

  describe('hashType', function () {
    //TODO:
  });

  describe('tupleType', function () {
    //TODO:
  });

  describe('array', function () {
    //TODO:
  });

  describe('number', function () {
    it('is true for numbers', function () {
      expect(T.number.is(5)).toBe(true);
    });
    //TODO
  });

  describe('string', function () {
    //TODO
  });

  describe('fn', function () {
    //TODO:
  });

  describe('nones', function () {
    //TODO:
    
  });

  //it has predefined functions and properties
});
