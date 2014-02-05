"use strict";
var async = require('async');
var wrap = require('./lib/rox').wrap;


var wrapped;

function fib(n, callback) {
    if (n < 2) {
        setImmediate(function () {
            callback(null, n);
        });
        return;
    }
    async.parallel({
        a: function (cb) {
            wrapped(n - 1, cb);
        },
        b: function (cb) {
            wrapped(n - 2, cb);
        }
    }, function (err, result) {
        setTimeout(function () {
            callback(err, result.a + result.b);
        }, 300);
    });
}

fib._rox = {
    signature: "Fibonnaci",
    input: {
        n: Number
    },
    output: {
        sum: Number
    }
};

wrapped = wrap(fib);


wrapped(5, function () {
    console.log(arguments);
});


//1 1 2 3 5 8 13
//1 2 3 4 5 6 7