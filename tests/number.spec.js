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
var N = T.number;

describe('constraints.number', function () {
  it('matches numbers only', function () {
    expect(N.is(0)).toBe(true);
    expect(N.is(1)).toBe(true);
    expect(N.is(-1)).toBe(true);
    expect(N.is(1.1)).toBe(true);
    expect(N.is('1')).toBe(false);
    expect(N.is(/1/)).toBe(false);
  });

  it('ensures not 0', function () {
    var Nn0 = N.not0();
    expect(Nn0.is(0)).toBe(false);
    expect(Nn0.is(1)).toBe(true);
    expect(Nn0.is(-1)).toBe(true);
    expect(Nn0.is('0')).toBe(false);
  });

  it('ensures the number is finite', function () {
    var Finite = N.finite();
    expect(Finite.is(Number.POSITIVE_INFINITY)).toBe(false);
    expect(Finite.is(1)).toBe(true);
  });

  it('checks if the number is integer', function () {
    var Int = N.integer();
    expect(Int.is(1)).toBe(true);
    expect(Int.is(1.1)).toBe(false);
  });

  it('puts upper bounds', function () {
    var lt5 = N.lt(5),
    lteq5 = N.lteq(5);

    expect(lt5.is(5)).toBe(false);
    expect(lt5.is(4)).toBe(true);
    expect(lt5.is(6)).toBe(false);

    expect(lteq5.is(5)).toBe(true);
    expect(lteq5.is(4)).toBe(true);
    expect(lteq5.is(6)).toBe(false);
  });

  it('puts lower bounds', function () {
    var gt5 = N.gt(5),
    gteq5 = N.gteq(5);

    expect(gt5.is(5)).toBe(false);
    expect(gt5.is(4)).toBe(false);
    expect(gt5.is(6)).toBe(true);

    expect(gteq5.is(5)).toBe(true);
    expect(gteq5.is(4)).toBe(false);
    expect(gteq5.is(6)).toBe(true);
  });

  it('puts both bounds', function () {
    var from3to5 = N.bounds(3, 5);
    expect(from3to5.is(2)).toBe(false);
    expect(from3to5.is(3)).toBe(true);
    expect(from3to5.is(4)).toBe(true);
    expect(from3to5.is(5)).toBe(false);
    expect(from3to5.is(6)).toBe(false);
  });
});