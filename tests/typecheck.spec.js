/* jshint globalstrict: true */
/* global require: false */
/* global describe: false */
/* global it: false */
/* global expect: false */
/* global process: false */
/* global console: false */
/* jshint maxstatements: 30 */
"use strict";

var typecheck = require("../index.js")();

describe("typecheck", function () {
  it("checks primitives successfully", function () {
    expect(typecheck.check("array", []))        .toBe(true);
    expect(typecheck.check("array", arguments)) .toBe(false);

    expect(typecheck.check("number", 3.14))     .toBe(true);
    expect(typecheck.check("number", "3.14"))   .toBe(false);

    expect(typecheck.check("string", "hi"))     .toBe(true);
    expect(typecheck.check("string", 5))        .toBe(false);

    expect(typecheck.check("date", new Date())) .toBe(true);
    expect(typecheck.check("date", "2000-10-10")).toBe(false);

    var myfn = function (a, b, c) {};
    expect(typecheck.check("function", myfn))   .toBe(true);
    expect(typecheck.check("function", 5))      .toBe(false);
    expect(typecheck.check("function.args(3)", myfn)).toBe(true);
  });

  it("checks arrays based on type definition", function () {
    expect(typecheck.check([""], [])).toBe(true);

    expect(typecheck.check([".notEmpty()"], [])).toBe(false);
    expect(typecheck.check([".notEmpty()"], [1])).toBe(true);

    var undef;
    expect(typecheck.check([".exists()"], null )).toBe(false);
    expect(typecheck.check([".exists()"], undef)).toBe(false);
    expect(typecheck.check([".exists()"], []   )).toBe(true);

    expect(typecheck.check(["", "number"], [1, 2, 3])).toBe(true);
    expect(typecheck.check(["", "string"], ["h", "2", "3"])).toBe(true);
    expect(typecheck.check(["", "number", "string"], [1, "2", 3])).toBe(true);
    expect(typecheck.check(["", "number", "string"], ["1", "2", 3])).toBe(false);
    expect(typecheck.check(
      ["", "number", "string", "date", ["", "array"]],
      [1, "2", new Date(), [[]]]
    )).toBe(true);

    expect(typecheck.check(
      ["", "number", "string", "date", [".notEmpty()"]],
      [1, "2", new Date(), [1]]
    )).toBe(true);
  });

  it("checks object properties as well as object existance", function () {
    var TypeA = {
      "hello":"string.exists()",
      "greet":"function.args(1)"
    };
    var TypeB = {
      "bye":"string.exists()",
      "sayit":"function.args(1)"
    };

    var A = {
      "hello":"Hello my dear friend, ",
      "greet": function (name) {
        console.log(this.hello + name);
      }
    };
    var B = {
      "bye":"Goodbye, ",
      "sayit":function (name) {
        console.log(this.bye + name);
      }
    };

    expect(typecheck.check(TypeA, A)).toBe(true);
    expect(typecheck.check(TypeB, A)).toBe(false);
    expect(typecheck.check(TypeA, B)).toBe(false);
    expect(typecheck.check(TypeB, B)).toBe(true);
  });

  it("checks object properties recursively", function () {
    var TypeC = {
      "simple": "number",
      "complicated": {
        "hello": "string"
      },
      "anarray": [".notEmpty()", "number"]
    };
    var C = {
      "simple": 3,
      "complicated": {
        "hello": "world"
      },
      "anarray": [1, 2, 3]
    };

    expect(typecheck.check(TypeC, C)).toBe(true);

    var D = {
      "simple": 3,
      "complicated": {
        "hello": 5
      },
      "anarray": [1, 2, 3]
    };
    expect(typecheck.check(TypeC, D)).toBe(false);
  });

  it("throws exception when assert is invoked with not fulfilling argments", function () {
    expect(function () {
      typecheck.assert("number", "5");
    }).toThrow();
    expect(function () {
      typecheck.assert("number", 5);
    }).not.toThrow();
  });

  it("matches possible nulls or undefined using noneOr", function () {
    var StrictType = {
      "simple": "number",
      "complicated": {
        "hello": "string"
      },
      "anarray": [".notEmpty()", "number"]
    };

    var NoneType = {
      "simple": "number",
      "complicated": {
        "hello": typecheck.noneOr("string")
      },
      "anarray": [".notEmpty()", "number"]
    };

    var E = {
      "simple": 3,
      "anarray": [1, 2, 3]
    };

    var E1 = Object.create(E);
    E1.complicated = { "hello": "world" };
    expect(typecheck.check(StrictType, E1)).toBe(true);
    expect(typecheck.check(NoneType, E1)).toBe(true);

    var E2 = Object.create(E);
    E2.complicated = {}; //undefined
    expect(typecheck.check(StrictType, E2)).toBe(false);
    expect(typecheck.check(NoneType, E2)).toBe(true);

    var E3 = Object.create(E);
    E3.complicated = { "hello": null };
    expect(typecheck.check(StrictType, E3)).toBe(false);
    expect(typecheck.check(NoneType, E3)).toBe(true);

    var E4 = Object.create(E);
    E4.complicated = { "hello": 4 };
    expect(typecheck.check(StrictType, E4)).toBe(false);
    expect(typecheck.check(NoneType, E4)).toBe(false);
  });

  it("adds new types using typecheck.define(name, typedef, constraints)", function () {
    var StrictType = {
      "simple": "number",
      "complicated": {
        "hello": "string"
      },
      "anarray": [".notEmpty()", "number"]
    };

    var E = {
      "simple": 3,
      "anarray": [1, 2, 3],
      "complicated": { "hello": "world" }
    };

    typecheck.define("mytype", StrictType, {});

    expect(typecheck.check("mytype", E)).toBe(true);
  });

  it("adds new types using typecheck.define(name, typedef, constraints)", function () {
    var NumberContainer = {
      "value": "number"
    };

    var constraints = {
      positive: function () { return this.value.value > 0; },
      negative: function () { return this.value.value < 0; }
    };

    var pos = { value: 5 };
    var zero = { value: 0 };
    var neg = { value: -5 };

    typecheck.define("numcontainer", NumberContainer, constraints);

    expect(typecheck.check("numcontainer.positive()", pos)).toBe(true);
    expect(typecheck.check("numcontainer.positive()", zero)).toBe(false);
    expect(typecheck.check("numcontainer.positive()", neg)).toBe(false);

    expect(typecheck.check("numcontainer.negative()", pos)).toBe(false);
    expect(typecheck.check("numcontainer.negative()", zero)).toBe(false);
    expect(typecheck.check("numcontainer.negative()", neg)).toBe(true);

    typecheck.defineConstraint("numcontainer", "zero", function () { return this.value.value === 0; });

    expect(typecheck.check("numcontainer.zero()", pos)).toBe(false);
    expect(typecheck.check("numcontainer.zero()", zero)).toBe(true);
    expect(typecheck.check("numcontainer.zero()", neg)).toBe(false);
  });

  it("creates copy of its state that is not affected by future changes", function () {
    var S = "ok";
    typecheck.define("copied", "string");
    var tc = typecheck.copy();
    typecheck.define("not_copied", "string");
    tc.define("not_in_orig", "string");

    expect(typecheck.check("copied", S)).toBe(true);
    expect(       tc.check("copied", S)).toBe(true);

    expect(typecheck.check("not_copied", S)).toBe(true);
    expect(function () {
                  tc.check("not_copied", S);
    }).toThrow();

    expect(function () {
      typecheck.check("not_in_orig", S);
    }).toThrow();
    expect(  tc.check("not_in_orig", S)).toBe(true);
  });

  it("parses default definition when default object is passed", function () {
    var type = {
      "hello":"string //default: 'trotinetka'",
      "age":  "number //default: 18"
    };

    var expected = {
      _: {
        "hello": "trotinetka",
        "age": 18
      }
    };

    var defaultVal = {};
    typecheck.define("defaultTest", type, {}, defaultVal);
    expect(defaultVal).toEqual(expected);
  });
});
