'use strict';

var T = require('constraints');


// Check
T.string.is('hello');


var MyType = T.hashType({
  name: T.string.notEmpty()
});
// Assert
try {
  var value = {
    name: 'peter'
  };
  MyType.assert(value);
} catch (e) {
  //value is not K
}

// Are
var expectedArgs = T.tupleType(MyType, T.number, T.string);
function some(a, b, c) {
  expectedArgs.assert(arguments);
}

T.fn(MyType, MyType, T.number.optional(), T.string.optional(), function (bla, bla2, bla3) {
  //ensure args and return type are of the expected types
});

var vtype = T.string.or(T.number).or(T.fn).optional();
vtype.is("hello");

var winnersType = T.array.typed(T.string).size(3);
