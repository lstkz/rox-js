"use strict";
var _ = require('underscore');


function NumberValidator() {
    this.name = "number";
}

NumberValidator.prototype.validate = function (name, value, params) {
    if (params.castString && _.isString(value)) {
        if (_.isNaN(Number(value))) {
            return new Error(name + " should be a number.");
        }
        value = Number(value);
    }
    if (!_.isNumber(value)) {
        return new Error(name + " should be a number.");
    }
    if (_.isNaN(value)) {
        return new Error(name + " should be a number. Got NaN.");
    }
    if (!isFinite(value)) {
        return new Error(name + " should be a number. Got Infinity.");
    }
    if (params.hasOwnProperty("max")) {
        var max = params.max;
        if (value > max) {
            return new Error(name + " should be less than " + max + ".");
        }
    }
    if (params.hasOwnProperty("min")) {
        var min = params.min;
        if (value < min) {
            return new Error(name + " should be greater than " + min + ".");
        }
    }
    return null;
};


module.exports = NumberValidator;