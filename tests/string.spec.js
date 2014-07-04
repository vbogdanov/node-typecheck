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
var S = T.string;

describe('constraints.string', function () {
  it('checks if a value is a string', function () {
    expect(S.is('1')).toBe(true);
    expect(S.is(1)).toBe(false);
  });  

  it('checks for not empty string', function () {
    var NE = S.notEmpty();
    expect(NE.is('')).toBe(false);
    expect(NE.is(' ')).toBe(true);
    expect(NE.is('1')).toBe(true);
  });
});