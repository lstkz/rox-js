"use strict";

var util = require('util');
var _ = require('underscore');

function _getType(name) {
    var Constructor = require('./typeValidators/' + name);
    return new Constructor();
}

function Validator() {
    this.types = {};
    this.registerType(_getType("number"));
    this.registerType(_getType("integer"), ["int"]);
    this.registerType(_getType("string"));
    this.registerType(_getType("any"));
    this.registerType(_getType("object"));
    this.registerType(_getType("boolean"), ["bool"]);
    this.registerType(_getType("array"));
}

function _isOptional(value, params) {
    return params && params.required === false && (value === null || value === undefined);
}

Validator.prototype._validateExt = function (name, value, rule, params) {
    if (_isOptional(value, params)) {
        return null;
    }
    var validator = this.types[rule];
    if (validator) {
        return validator.validate(name, value, params, this);
    }

    return new Error("Unknown validation type: " + rule);
};


Validator.prototype.getNameForDefinition = function (definition) {
    var type;
    if (_.isFunction(definition)) {
        type = definition.name;
    } else if (_.isArray(definition)) {
        type = "array";
    } else if (_.isObject(definition)) {
        if (definition.__obj === true) {
            type = "object";
        } else if (definition.hasOwnProperty("type")) {
            if (_.isFunction(definition.type)) {
                type = definition.type.name;
            } else {
                type = definition.type;
            }
        } else {
            type = "object";
        }
    } else {
        type = String(definition);
    }
    return type.toLowerCase().trim();
};

Validator.prototype.validate = function (name, value, definition) {
    var type, params = {};
    type = this.getNameForDefinition(definition);
    if (_.isObject(definition)) {
        params = definition;
    }
    params.__def = definition;
    var error, split = type.split("|"), i;
    if (split.length === 1) {
        return this._validateExt(name, value, type, params);
    }
    for (i = 0; i < split.length; i++) {
        error = this._validateExt(name, value, split[i], params);
        if (!error) {
            return null;
        }
    }
    return new Error(name + " should be one of the following types: " + split.join(", "));
};


Validator.prototype.registerType = function (typeValidator, names) {
    var self = this;
    self.types[typeValidator.name] = typeValidator;
    if (names && names.length) {
        names.forEach(function (name) {
            self.types[name] = typeValidator;
        });
    }
};


module.exports = Validator;