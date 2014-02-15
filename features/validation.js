"use strict";

var Validator = require("../lib/validation");
var validator = new Validator();
var _ = require('underscore');
var helper = {};

///example 1
//old way
function searchUsers(searchCriteria) {
    if (!_.isObject(searchCriteria)) {
        throw new Error('searchCriteria should be an Object');
    }
    if (!_.isNumber(searchCriteria.offset)) {
        throw new Error('searchCriteria.offset should be a number');
    }
    if (searchCriteria.offset < 0) {
        throw new Error('searchCriteria.offset should be >= 0');
    }
    if (!_.isNumber(searchCriteria.limit)) {
        throw new Error('searchCriteria.limit should be a number');
    }
    if (searchCriteria.limit < 1) {
        throw new Error('searchCriteria.limit should be >= 1');
    }
    //..code
}

//using helpers
function searchUsers(searchCriteria) {
    helper.checkObject(searchCriteria, "searchCriteria");
    helper.checkInteger(searchCriteria.offset, "searchCriteria.offset");
    helper.checkInteger(searchCriteria.limit, "searchCriteria.limit");
    helper.checkMinNumber(searchCriteria.offset, 0, "searchCriteria.offset");
    helper.checkMinNumber(searchCriteria.limit, 1, "searchCriteria.limit");
    //..code
}

//new way

function searchUsers(searchCriteria) {
    var definition = {
        offset: { type: "Integer", min: 0 },
        limit: { type: "Integer", min: 1  }
    };
    var error = validator.validate("searchCriteria", searchCriteria, definition);
    if (error) {
        throw error;
    }
}

//example 2
function searchUsers(searchCriteria) {
    var definition = {
        offset: { type: "Integer", min: 0 },
        limit: { type: "Integer", min: 1  },
        roles: [{"enum": ["admin", "superadmin", "user", "manager"]}],
        address: {
            street: {type: String, required: false},
            country: String
        }
    };
    var error = validator.validate("searchCriteria", searchCriteria, definition);
    if (error) {
        throw error;
    }
}

var criteria = {
    offset: 0,
    limit: 10,
    roles: ["admin", "user"],
    address: {
        country: "Poland"
    }
};

var result = searchUsers(criteria);


//example 3

validator.registerAlias("offset", { type: "Integer", min: 0 });
validator.registerAlias("limit", { type: "Integer", min: 1  });
validator.registerAlias("userRole", {"enum": ["admin", "superadmin", "user", "manager"]});

function searchUsers(searchCriteria) {
    var definition = {
        offset: "offset",
        limit: "limit",
        roles: ["userRole"],
        address: {
            street: {type: String, required: false},
            country: String
        }
    };
    var error = validator.validate("searchCriteria", searchCriteria, definition);
    if (error) {
        throw error;
    }
}