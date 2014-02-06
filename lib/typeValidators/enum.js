"use strict";
var _ = require('underscore');


function EnumValidator() {
    this.name = "enum";
}

EnumValidator.prototype.validate = function (name, value, params, validator) {
    var error = validator.validate(name, value, String), validValues = params["enum"];
    if (error) {
        return error;
    }
    var i;
    for (i = 0; i < validValues.length; i++) {
        if (value === validValues[i]) {
            return null;
        }
        if (value.toLowerCase() === validValues[i].toLowerCase()) {
            if (params.ignoreCase) {
                return null;
            }
            return new Error(name + " should be a case-sensitive enum value: " + validValues.join(', '));
        }
    }
    return new Error(name + " should be an enum value: " + validValues.join(', '));
};


module.exports = EnumValidator;