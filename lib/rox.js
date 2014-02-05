"use strict";

var util = require('util');
var _ = require('underscore');
var winston = require('winston');


function combineNames(names, values) {
    var index = 0, counter = 1;
    var ret = {};
    for (var prop in names) {
        var val = values[index++];
        if (val === undefined) {
            val = "<undefined>";
        }
        ret[prop] = val;
    }
    while (index < values.length) {
        ret["<undefined " + counter + ">"] = values[index++];
        counter++;
    }
    return ret;
}

function wrap(fn) {
    if (!_.isFunction(fn)) {
        throw Error("fn should be a function");
    }
    if (!_.isObject(fn._rox)) {
        throw Error("_rox should be an object");
    }
    if (!_.isObject(fn._rox.input)) {
        throw Error("_rox.input should be an object");
    }
    if (!_.isObject(fn._rox.output)) {
        throw Error("_rox.output should be an object");
    }
    if (!_.isString(fn._rox.signature)) {
        throw Error("_rox.signature should be a string");
    }

    var data = fn._rox, signature = data.signature;
    return function () {
        var paramCount = Object.keys(data.input).length,
            callbackParamCount = Object.keys(data.output).length,
            callback = arguments[arguments.length - 1],
            delegatedCallback,
            start = new Date().getTime();
        if (arguments.length !== paramCount + 1) {
            throw new Error(data.signature + " expects at least " +
                paramCount + " parameters and a callback.");
        }
        if (!_.isFunction(callback)) {
            throw new Error("callback argument must be a function.");
        }

        var inputParams = combineNames(data.input, arguments);
        winston.info("ENTER %s %j", data.signature, {input: inputParams}, {});

        // replace the callback with a log and cache supporting version
        delegatedCallback = function () {
            var cbArgs = arguments;
            var wrappedError;
            //if returned error, wrap this error and log to console
            if (cbArgs[0]) {
                var error = cbArgs[0];
                winston.error("%s %j\n", data.signature, {input: inputParams}, error.stack);
                callback(error);
            } else {
                var callbackArgumentsOk = true;
                //check callback parameters existence
                if (cbArgs.length !== callbackParamCount + 1) {
                    //if callback has only callback parameters, we dont have to pass 'null' value
                    //we can call 'callback()' instead of 'callback(null)'
                    callbackArgumentsOk = cbArgs.length === 1 && callbackParamCount === 0;
                }
                var outputParams = combineNames(data.output, Array.prototype.slice.call(cbArgs, 1));
                if (callbackArgumentsOk) {
                    var diff = new Date().getTime() - start;
                    winston.info("EXIT %s %j", data.signature, {input: inputParams, output: outputParams, time: diff + "ms"}, {});
                    callback.apply(this, cbArgs);
                } else {
                    if (callbackParamCount > cbArgs.length - 1) {
                        var missingParams = Object.keys(data.output).slice(cbArgs.length - 1);
                        wrappedError = new Error("Missing callback parameter(s): " + missingParams.join(", "));
                    } else {
                        wrappedError = new Error("Too many callback parameters");
                    }
                    winston.error("%s %j\n", data.signature, {input: inputParams, output: outputParams}, wrappedError.stack);
                    callback(wrappedError);
                }
            }
        };
        var args = arguments;
        args[args.length - 1] = delegatedCallback;
        try {
            fn.apply(this, args);
        } catch (e) { // catch errors within the method body
            delegatedCallback.call(this, e);
        }
    };
}




module.exports = {
    wrap: wrap
};