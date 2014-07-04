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
var A = T.array;
describe('constraints.array', function () {
  it('returns true for arrays', function () {
    expect(A.is([])).toBe(true);
    expect(A.is(arguments)).toBe(false);
    expect(A.is(new Array(3))).toBe(true);
    expect(A.is({})).toBe(false);
  })

  it('can be limited to not-empty arrays', function () {
    var NE = A.notEmpty();
    expect(NE.is([])).toBe(false);
    expect(NE.is([3])).toBe(true);
  });

  it('can be fixed to certain size', function () {
    var A3 = A.size(3);
    expect(A3.is([2,3])).toBe(false);
    expect(A3.is([2,3,4,5])).toBe(false);
    expect(A3.is([1,2,3])).toBe(true);
  });

  it('checks types of all elements of the array', function () {
    var TA = A.typed(T.number);
    expect(TA.is([])).toBe(true);
    expect(TA.is([1,2])).toBe(true);
    expect(TA.is(['1','2'])).toBe(false);
    expect(TA.is([1,'2'])).toBe(false);
  });

});