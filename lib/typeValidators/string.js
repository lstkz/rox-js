"use strict";
var _ = require('underscore');


function StringValidator() {
    this.name = "string";
}

StringValidator.prototype.validate = function (name, value, params) {
    if (!_.isString(value)) {
        return new Error(name + " should be a string.");
    }
    if (params.empty !== true && value.trim().length === 0) {
        return new Error(name + " should be a non-empty string.");
    }
    if (params.hasOwnProperty("maxLength")) {
        var max = params.maxLength;
        if (value.length > max) {
            return new Error(name + " should contains max " + max + " characters.");
        }
    }
    if (params.hasOwnProperty("minLength")) {
        var min = params.minLength;
        if (value.length < min) {
            return new Error(name + " should contains min " + min + " characters.");
        }
    }
    return null;
};


module.exports = StringValidator;
