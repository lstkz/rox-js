"use strict";

var util = require('util');
var _ = require('underscore');

function validateNumber(name, value, params) {
    if (_.isNaN(value)) {
        return new Error(name + " should be a number. Got NaN.");
    }
    if (!isFinite(value)) {
        return new Error(name + " should be a number. Got Infinity.");
    }
    if (!_.isNumber(value)) {
        return new Error(name + " should be a number.");
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
}

function validateInteger(name, value, params) {
    var error = validateNumber(name, value, params);
    if (error) {
        return error;
    }
    if (value % 1 !== 0) {
        return new Error(name + " should be a integer.");
    }
    return null;
}

function validateString(name, value, params) {
    if (!_.isString(value)) {
        return new Error(name + " should be a string.");
    }
    if (params.empty !== true && value.trim().length === 0) {
        return new Error(name + " should be a non-empty string.");
    }
    if (params.hasOwnProperty("maxLength")) {
        var max = params.maxLength;
        if (value.length > max) {
            return new Error(name + " should be contains max " + max + " characters.");
        }
    }
    if (params.hasOwnProperty("minLength")) {
        var min = params.minLength;
        if (value.length < min) {
            return new Error(name + " should be contains min " + min + " characters.");
        }
    }
    return null;
}

function isOptional(value, params) {
    return params && params.required === false && (value === null || value === undefined);

}


function validate(name, value, definition) {
    var type, params = {};
    if (_.isFunction(definition)) {
        type = definition.name;
    } else if (_.isObject(definition)) {
        if (definition.hasOwnProperty("type")) {
            if (_.isFunction(definition.type)) {
                type = definition.type.name;
            } else {
                _throw(validateString("definition.type", definition.type, {}));
                type = definition.type;
            }
        } else {
            type = "object";
        }
        params = definition;
    } else {
        type = String(definition);
    }
    type = type.toLowerCase().trim();
    if (type === "*") {
        return null;
    }
    var error, split = type.split("|"), i;
    if (split.length === 1) {
        return validateExt(name, value, type, params);
    }
    for (i = 0; i < split.length; i++) {
        error = validateExt(name, value, split[i], params);
        if (!error) {
            return null;
        }
    }
    return new Error(name + " should be one of the following types: " + split.join(", "));
}

function validateObject(name, value, params) {
    if (!_.isObject(value)) {
        return new Error(name + " should be an object.");
    }
    var prop, error = null;
    for (prop in params) {
        if (params.hasOwnProperty(prop)) {
            error = error || validate(name + "." + prop, value[prop], params[prop]);
        }
    }
    return error;
}

function validateExt(name, value, rule, params) {
    if (isOptional(value, params)) {
        return null;
    }
    if (rule === "number") {
        return validateNumber(name, value, params);
    }
    if (rule === "integer") {
        return validateInteger(name, value, params);
    }
    if (rule === "string") {
        return validateString(name, value, params);
    }
    if (rule === "object") {
        return validateObject(name, value, params);
    }
    return new Error("Unknown validation type: " + rule);
}

function _throw(err) {
    if (err) {
        throw err;
    }
}


module.exports = {
    validate: validate
};