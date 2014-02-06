"use strict";
var _ = require('underscore');


function BoolValidator() {
    this.name = "boolean";
}

BoolValidator.prototype.validate = function (name, value) {
    if (!_.isBoolean(value)) {
        return new Error(name + " should be a boolean.");
    }
    return null;
};


module.exports = BoolValidator;