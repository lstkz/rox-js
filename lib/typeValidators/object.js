"use strict";
var _ = require('underscore');


function ObjectValidator() {
    this.name = "object";
}

ObjectValidator.prototype.validate = function (name, value, params, validator) {
    if (!_.isObject(value)) {
        return new Error(name + " should be an object.");
    }
    var prop, error = null;
    for (prop in params) {
        if (params.hasOwnProperty(prop) && prop.indexOf("__") !== 0) {
            error = error || validator.validate(name + "." + prop, value[prop], params[prop]);
        }
    }
    return error;
};


module.exports = ObjectValidator;