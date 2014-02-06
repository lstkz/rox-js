"use strict";
var _ = require('underscore');


function IntegerValidator() {
    this.name = "integer";
}

IntegerValidator.prototype.validate = function (name, value, params, validator) {
    var newParams = _.clone(params);
    if (_.isObject(newParams)) {
        newParams.type = Number;
    } else {
        newParams = Number;
    }
    var error = validator.validate(name, value, newParams);
    if (error) {
        return error;
    }
    if (value % 1 !== 0) {
        return new Error(name + " should be a integer.");
    }
    return null;
};


module.exports = IntegerValidator;