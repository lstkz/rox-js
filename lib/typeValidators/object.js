"use strict";
var _ = require('underscore');


function ObjectValidator() {
    this.name = "object";
}

ObjectValidator.prototype.validate = function (name, value, params, validator) {
    if (!_.isObject(value) || _.isArray(value)) {
        return new Error(name + " should be an object.");
    }
    var prop, error = null, foundParams = {};
    for (prop in params) {
        if (params.hasOwnProperty(prop) && prop.indexOf("__") !== 0) {
            error = error || validator.validate(name + "." + prop, value[prop], params[prop]);
            foundParams[prop] = true;
        }
    }
    if (params.__strict !== false) {
        for (prop in value) {
            if (Object.prototype.hasOwnProperty.call(value, prop) && prop.indexOf("__") !== 0) {
                if (!foundParams[prop]) {
                    return new Error("Unexpected property: " + name + "." + prop);
                }
            }
        }
    }
    return error;
};


module.exports = ObjectValidator;
