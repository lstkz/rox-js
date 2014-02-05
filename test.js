"use strict";
var wrap = require('./lib/rox').wrap;

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


function sample(a, b, any, callback) {

}


function _O(a) {

}

sample._rox = {
    signature: "sample",
    input: {
        a: { type: Number, max: 100, min: 10 },
        c: {
            address: {
                street: String,
                nr: { type: "integer", min: 1 }
            },
            name: { type: String, required: false, maxLength: 40 },
            lastName: String
        },
        any: "*"
    },
    output: {}
};


var wrappedTest = wrap(test);


wrappedTest(1, 2, function () {
   // console.log(arguments);
});

