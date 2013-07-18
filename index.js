if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

  var FORBIDDEN_TYPENAMES = ["__proto__", "prototype", "__", "", "hasOwnProperty"]; //add others here
  var DEFAULT_STRING = "//default:";

  function handleDefaultEval(evalString, _default) {
    var index = evalString.indexOf(DEFAULT_STRING);
    if (index === -1) {
      _default._ = null;
      return;
    }
    var def = evalString.substr(index + DEFAULT_STRING.length);
    _default._ = eval(def);
  }

  return function createTC() {
    var registry = Object.create(null);
    var tc = {};
    /**
     * This function returns a function that can check for the passed type.
     * a definition might consist of 
     * string: type names + constraints,
     * object: containing properties which are type definitions themselfs + __ property describing object constraints
     * 
     * argument1 - an object defining the type/type name
     * returns a function f(item):boolean checking the passed type.
     */
    tc.buildCheck = function (definition, _default) { //returns function (item):boolean
      _default = _default || { _: null };//object with defaults
      var type = typeof definition;
      if (type === "object" && Array.isArray(definition)) {
        type = "array";
      }

      switch (type) {
        case "function":
          return definition;
        case "string":
          return stringHandler(definition, _default);
        case "array":
          return arrayHandler(definition, _default);
        default:
          return objectHandler(definition, _default);
      }
    };

    /**
     * This function returns whether value fulfills the type
     * argument1: the type to fullfill
     * argument2: the value to check for
     * returns: boolean - true if value fulfills the type
     */
    tc.check = function (type, value) {
      return tc.buildCheck(type)(value);
    };

    /**
     * returns true if value is null or undefined
     */
    tc.none = function (value) {
      return typeof value === "undefined" || value === null;
    };

    /**
     * Build matching function for null, undefined or type.
     */
    tc.noneOr = function (type) {
      var fn = tc.buildCheck(type);
      return function (item) {
        return tc.none(item) || fn(item);
      };
    };

    /**
     * This function checks if value fulfills the type and throws exception otherwise.
     * A shorthand for 
     * <code>

      if (! typecheck.check(type, value)) {
        throw "Wrong Type";
      }

      </code>
     * argument1: the type to fullfill
     * argument2: the value to check for
     */
    tc.assert = function (type, value) {
      if (! tc.check(type, value)) {
        throw new Error("Wrong Type");
      }
    };

    /**
     * Defines a named type. The second argument is used to as parameter for #buildCheck, the third one is list of constraint functions.
     * argument1: name
     * argument2: definition
     * argument3: object with constraint defining functions
     * example:
     * <code>

      typecheck.define("array",
        function (item) {
          return Array.isArray(item);
        },
        {
          notEmpty: function () { return this.value.length > 0; },
          exists: function () { return !!this.value; }
        });

      </code>
     */
    tc.define = function (name, definition, limitations, _default) {
      registry[name] = {
        isInstance: tc.buildCheck(definition, _default),
        constraints: limitations || null
      };
    };

    /**
      * This method adds constraint to existing type
      *
      */
    tc.defineConstraint = function (name, limitName, limitFn) {
      tc.assert("typename", name);
      var typeDesc = registry[name];
      if (tc.none(typeDesc)) throw new Error("Unknown Type: " + name);
      typeDesc.constraints = typeDesc.constraints || Object.create(null);
      typeDesc.constraints[limitName] = limitFn;
    };

    tc.copy = function () {
      var newtc = createTC();
      for (var k in registry) {
        var def = registry[k];
        newtc.define(k, def.isInstance, copyProperties(def.constraints));
      }
      return newtc;
    };

    Object.freeze(tc);
    registerBaseTypes(tc);
    return tc;

    function copyProperties(obj, res) {
      if(tc.none(res)) {
        res = Object.create(null);
      }
      for (var k in obj) {
        res[k] = obj[k];
      }
      return res;
    }

    function defaultObjectCheck(item) {
      return !!item; //not undefined or null
    }

    function propertiesCheck(task,item) {
      for (var key in task) {
        var fulfill = task[key](item[key]);
        if (! fulfill) return false;
      }
      return true;
    }

    function objectHandler(descr, _default) {
      _default._ = {}; //for unit tests sake. isEqual does not work without Object.prototype
      var alter = Object.create(null);
      var objCheck = descr.__ ? tc.buildCheck(descr.__): defaultObjectCheck;

      for (var key in descr) {
        if(key === "__")
          continue;
        var def = { _: null };
        alter[key] = tc.buildCheck(descr[key], def);
        _default._[key] = def._;
      }
      return function (item) {
        return (! tc.none(item)) && objCheck(item) && propertiesCheck(alter, item);
      };
    }

    function arrayElementsCheck(expected, actual) {
      if (expected.length === 0) return true; //no requirements
      for (var i = 0; i < actual.length; i ++) {
        var ei = i % expected.length;
        var fulfill = expected[ei](actual[i]);
        if (! fulfill)
          return false;
      }
      return true;
    }

    function arrayHandler(definition, _default) {
      var arrayLimits = tc.buildCheck("array" + definition[0],  _default);
      var alter = [];
      for (var i = 1; i < definition.length; i ++) {
        alter.push(tc.buildCheck(definition[i]));
      }
      return function (item) {
        return (! tc.none(item)) && arrayLimits(item) && arrayElementsCheck(alter, item);
      };
    }

    function evaluate(evalString, EVALED) {
      var calls = evalString.split(".");
      for (var i = 0; i < calls.length; i ++) {
        var str = calls[i];
        if(! str) continue;
        var res = eval("EVALED." + str);
        if (!res) return false;
      }
      return true;
    }

    function inString(str, search) {
      return str.indexOf(search) !== -1;
    }

    function stringHandler (definition, _default) {
      var limitationsIndex = definition.length;
      if (inString(definition, DEFAULT_STRING)) {
        limitationsIndex = definition.indexOf(DEFAULT_STRING);
      }
      if (inString(definition, ".")) {
        limitationsIndex = definition.indexOf(".");
      }
      var typeName = definition.substr(0, limitationsIndex);
      //in case the string starts with .
      if (! typeName) typeName = "object";
      var evalString = limitationsIndex < definition.length? definition.substr(limitationsIndex): "";
      handleDefaultEval(evalString, _default);

      return function (item) {
        var type = registry[typeName];
        if (typeof type === "undefined") throw new Error("Unknown Type: " + typeName);

        var EVALED = Object.create(type.constraints);
        EVALED.value = item;
        return (! tc.none(item)) && type.isInstance(item) && evaluate(evalString, EVALED);
      };
    }

    function registerBaseTypes(tc) {
      tc.define("object",
        function (item) {
          return true;
        },
        {
          defined: function () { return typeof this.value !== "undefined"; },
          exists: function () { return !!this.value; }
        });

      tc.define("string",
        function (item) {
          return typeof item === "string";
        },
        {
          notEmpty: function () { return this.exists() && (!!this.value.trim()); },
          exists: function () { return !!this.value; }
        });

      tc.define("array",
        function (item) {
          return Array.isArray(item);
        },
        {
          notEmpty: function () { return this.value.length > 0; },
          exists: function () { return !!this.value; }
        });

      tc.define("number",
        function (item) {
          return typeof item === "number";
        },
        {

        });

      tc.define("date",
        function (item) {
          return Date.prototype.isPrototypeOf(item);
        },
        {

        });

      tc.define("function",
        function (item) {
          return typeof item === "function";
        },
        {
          args: function (count) { return this.value.length === count; }
        });

      tc.define("typename",
        function (item) {
          return tc.check("string", item) && FORBIDDEN_TYPENAMES.indexOf(item) === -1;
        },
        {
          args: function (count) { return this.value.length === count; }
        });
    }
  };
});

