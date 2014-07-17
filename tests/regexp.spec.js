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
var R = T.regexp;

describe('constraints.regexp', function () {
  it('checks if a value is regexp', function () {
    expect(R.is(/a+b/)).toBe(true);
    expect(R.is("a+b")).toBe(false);
  });
});