"use strict";
var _ = require('underscore');


function ArrayValidator() {
    this.name = "array";
}

ArrayValidator.prototype.validate = function (name, value, params, validator) {
    if (!_.isArray(value)) {
        return new Error(name + " should be an array.");
    }
    var definition = params.__def;
    if (_.isArray(definition) && definition.length) {
        //validate each element of array if has a valid type
        var i, j;
        for (i = 0; i < value.length; i++) {
            var ele = value[i],
                eleName = name + "[" + i + "]",
                valid = false,
                error;
            for (j = 0; j < definition.length; j++) {
                error = validator.validate(eleName, ele, definition[j]);
                if (!error) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                if (definition.length === 1) {
                    return error;
                }
                var types = _.map(definition, validator.getNameForDefinition.bind(validator));
                return new Error(eleName + " should be one of the following types: " + types.join(", ") + ".");
            }
        }
    }
    if (params.empty !== true && value.length === 0) {
        return new Error(name + " should be a non-empty array.");
    }
    return null;
};


module.exports = ArrayValidator;