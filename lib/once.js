"use strict";
var util = require('util');
var _ = require('underscore');
var winston = require('winston');

function once(fn, options) {
    if (!_.isFunction(fn)) {
        throw new Error("fn should be a function");
    }
    if (!_.isObject(options)) {
        throw new Error("options.input should be an object");
    }
    if (!_.isString(options.signature)) {
        throw new Error("options.signature should be a string");
    }

    var signature = options.signature;
    return function () {
        var callback = arguments[arguments.length - 1],
            delegatedCallback,
            called = false;
        if (!_.isFunction(callback)) {
            throw new Error("callback argument must be a function.");
        }
        delegatedCallback = function () {
            if (called) {
                winston.error("callback called more than once in " + signature);
                return;
            }
            called = true;
            callback.apply(this, arguments);
        };
        var args = arguments;
        args[args.length - 1] = delegatedCallback;
        fn.apply(this, args);
    };
}

module.exports = once;