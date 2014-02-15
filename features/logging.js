"use strict";

var logging = require("../lib/logging");
var util = require('util');

//example 1
//old way
function addNumbers(a, b, callback) {
    var inputSerialized = JSON.stringify({input: {a: a, b: b} }), sum, outputSerialized;
    util.log("ENTER addNumbers " + inputSerialized);

    //main application logic goes here
    sum = a + b;

    outputSerialized = JSON.stringify({output: {sum: sum}});
    util.log("EXIT addNumbers " + inputSerialized + ", " + outputSerialized);
    callback(null, sum);
}


function addNumbers(a, b, callback) {
    callback(null, a + b);
}

var wrappedSum = logging(addNumbers, {signature: "addNumbers", input: ["a", "b"], output: ["sum"]});


wrappedSum(1, 2, function (err, sum) {

});
