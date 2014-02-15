"use strict";
var util = require('util');
var _ = require('underscore');
var winston = require('winston');

function combineNames(names, values) {
    var index = 0, counter = 1;
    var ret = {};
    for (index = 0; index < names.length; index++) {
        var val = values[index];
        if (val === undefined) {
            val = "<undefined>";
        }
        ret[names[index]] = val;
    }
    while (index < values.length) {
        ret["<undefined " + counter + ">"] = values[index++];
        counter++;
    }
    return ret;
}



function logging(fn, options) {
    if (!_.isFunction(fn)) {
        throw new Error("fn should be a function");
    }
    if (!_.isObject(options.input)) {
        throw new Error("options.input should be an object");
    }
    if (!_.isObject(options.output)) {
        throw new Error("options.output should be an object");
    }
    if (!_.isString(options.signature)) {
        throw new Error("options.signature should be a string");
    }

    var input = options.input,
        output = options.output,
        signature = options.signature;
    return function () {
        var paramCount = input.length,
            callbackParamCount = output.length,
            callback = arguments[arguments.length - 1],
            delegatedCallback,
            start = new Date().getTime();
        if (arguments.length !== paramCount + 1) {
            throw new Error(signature + " expects at least " +
                paramCount + " parameters and a callback.");
        }
        if (!_.isFunction(callback)) {
            throw new Error("callback argument must be a function.");
        }

        var inputParams = combineNames(input, arguments);
        winston.info("ENTER %s %j", signature, {input: inputParams}, {});

        // replace the callback with a log and cache supporting version
        delegatedCallback = function () {
            var cbArgs = arguments;
            var wrappedError;
            //if returned error, wrap this error and log to console
            if (cbArgs[0]) {
                var error = cbArgs[0];
                winston.error("%s %j\n", signature, {input: inputParams}, error.stack);
                callback(error);
            } else {
                var callbackArgumentsOk = true;
                //check callback parameters existence
                if (cbArgs.length !== callbackParamCount + 1) {
                    //if callback has only callback parameters, we dont have to pass 'null' value
                    //we can call 'callback()' instead of 'callback(null)'
                    callbackArgumentsOk = cbArgs.length === 1 && callbackParamCount === 0;
                }
                var outputParams = combineNames(output, Array.prototype.slice.call(cbArgs, 1));
                if (callbackArgumentsOk) {
                    var diff = new Date().getTime() - start;
                    winston.info("EXIT %s %j", signature, {input: inputParams, output: outputParams, time: diff + "ms"}, {});
                    callback.apply(this, cbArgs);
                } else {
                    if (callbackParamCount > cbArgs.length - 1) {
                        var missingParams = output.slice(cbArgs.length - 1);
                        wrappedError = new Error("Missing callback parameter(s): " + missingParams.join(", "));
                    } else {
                        wrappedError = new Error("Too many callback parameters");
                    }
                    winston.error("%s %j\n", signature, {input: inputParams, output: outputParams}, wrappedError.stack);
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

module.exports = logging;