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
var F = T.fn;
describe('constraints.fn', function () {
  it('checks if a value is a function', function () {
    var aFunction = function () {};
    expect(F.is(aFunction)).toBe(true);
    expect(F.is(5)).toBe(false);
  });

  it('wraps a function in typesafe advice', function () {
    var sum = function (a, b) {
      return a + b;
    },
    sumSafe = F.safe(T.number, T.number, T.number, sum),
    sumNotWorking = F.safe(T.string, T.number, T.number, sum);

    expect(function () {
      sum(1,2);
    }).not.toThrow();

    expect(function () {
      sum('1','2');
    }).not.toThrow();

    expect(function () {
      sumSafe(1, 2);
    }).not.toThrow();

    expect(function () {
      sumSafe('1', '2');
    }).toThrow();

    expect(function () {
      sumNotWorking(1, 2);
    }).toThrow();

    expect(function () {
      sumNotWorking('1', '2');
    }).toThrow();

  });
});