"use strict";
var util = require('util');
var _ = require('underscore');
var winston = require('winston');

function timeout(fn, options) {
    if (!_.isFunction(fn)) {
        throw new Error("fn should be a function");
    }
    if (!_.isObject(options)) {
        throw new Error("options.input should be an object");
    }
    if (!_.isString(options.signature)) {
        throw new Error("options.signature should be a string");
    }
    if (!_.isNumber(options.timeout)) {
        throw new Error("options.time should be a number");
    }

    var signature = options.signature;
    return function () {
        var callback = arguments[arguments.length - 1],
            delegatedCallback,
            called = false,
            timeoutId;
        if (!_.isFunction(callback)) {
            throw new Error("callback argument must be a function.");
        }
        timeoutId = setTimeout(function () {
            winston.error("callback never called in " + signature);
            callback(new Error('Callback never called'));
            called = true;
        }, options.timeout);
        delegatedCallback = function () {
            if (called) {
                winston.error("callback called after timeout in " + signature);
                return;
            }
            clearTimeout(timeoutId);
            callback.apply(this, arguments);
        };
        var args = arguments;
        args[args.length - 1] = delegatedCallback;
        fn.apply(this, args);
    };
}

module.exports = timeout;