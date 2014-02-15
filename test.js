"use strict";
var wrap = require('./lib/rox').wrap;
var async = require('async');

function test(a, b, callback) {
    callback(null, a + b);
}

test._rox = {
    signature: "TestMethod",
    input: {
        a: Number,
        b: Number
    },
    output: {
        sum: Number
    }
};
//
//
//
//var wrappedTest = wrap(test);
//
//
//wrappedTest(1, 'a', function () {
//   console.log(arguments);
//});


Object.prototype.asd = function () {
    console.log('x');
}

function Foo() {

}

Foo.prototype.test = { a: "b"};

var foo = new Foo();

Foo.prototype.test = 'a';


for (var prop in Foo.prototype) {
    console.log(prop);
}

foo.asd();

//console.log(foo.test);

