"use strict";
var _ = require('underscore');


function AnyValidator() {
    this.name = "*";
}

AnyValidator.prototype.validate = function (name, value) {
    if (value === null || value === undefined) {
        return new Error(name + " should be defined.");
    }
    return null;
};


module.exports = AnyValidator;