
"use strict";
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require('chai').assert;
var async = require('async');

var Validator = require("../lib/validation");

describe('Validation', function () {

    var validator;
    beforeEach(function () {
        validator = new Validator();
    });

    describe('any', function () {

        it("should validate string, definition = '*'", function (done) {
            var error = validator.validate("paramName", "str", "*");
            done(error);
        });

        it("should validate number, definition = '*'", function (done) {
            var error = validator.validate("paramName", 1, "*");
            done(error);
        });

        it("should return error if null, definition = '*'", function (done) {
            var error = validator.validate("paramName", null, "*");
            assert.ok(error);
            assert.equal(error.message, "paramName should be defined.");
            done();
        });

        it("should return error if undefined, definition = '*'", function (done) {
            var error = validator.validate("paramName", undefined, "*");
            assert.ok(error);
            assert.equal(error.message, "paramName should be defined.");
            done();
        });
    });

    describe('number', function () {

        it("should validate, definition = 'number'", function (done) {
            var error = validator.validate("paramName", 1, "number");
            done(error);
        });

        it("should validate float, definition = 'number'", function (done) {
            var error = validator.validate("paramName", 1.12, "number");
            done(error);
        });

        it("should validate, definition = Number", function (done) {
            var error = validator.validate("paramName", 1, Number);
            done(error);
        });

        it("should validate, definition = {type: 'number'}", function (done) {
            var error = validator.validate("paramName", 1, {type: 'number'});
            done(error);
        });

        it("should validate, definition = {type: Number}", function (done) {
            var error = validator.validate("paramName", 1, {type: Number});
            done(error);
        });

        it("should validate null, definition = {type: Number, required: false}", function (done) {
            var error = validator.validate("paramName", null, {type: Number, required: false});
            done(error);
        });

        it("should validate undefined, definition = {type: Number, required: false}", function (done) {
            var error = validator.validate("paramName", undefined, {type: Number, required: false});
            done(error);
        });

        it("should validate string, definition = {type: Number, castString: true}", function (done) {
            var error = validator.validate("paramName", "123", {type: Number, castString: true});
            done(error);
        });

        it("should return error if not number (null)", function (done) {
            var error = validator.validate("paramName", null, "number");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number.");
            done();
        });

        it("should return error if not number (string number)", function (done) {
            var error = validator.validate("paramName", "123", "number");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number.");
            done();
        });

        it("should return error if not number (NaN)", function (done) {
            var error = validator.validate("paramName", NaN, "number");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number. Got NaN.");
            done();
        });

        it("should return error if not number (Infinity)", function (done) {
            var error = validator.validate("paramName", Infinity, "number");
            assert.equal(error.message, "paramName should be a number. Got Infinity.");
            assert.ok(error);
            done();
        });

        it("should return error if greater than max", function (done) {
            var error = validator.validate("paramName", 100, {type: 'number', max: 10});
            assert.ok(error);
            assert.equal(error.message, "paramName should be less than 10.");
            done();
        });

        it("should return error if less than min", function (done) {
            var error = validator.validate("paramName", 100, {type: 'number', min: 1000});
            assert.ok(error);
            assert.equal(error.message, "paramName should be greater than 1000.");
            done();
        });
    });

    describe('integer', function () {
        it("should validate, definition = 'integer'", function (done) {
            var error = validator.validate("paramName", 1, "integer");
            done(error);
        });

        it("should validate, definition = {type: 'integer'}", function (done) {
            var error = validator.validate("paramName", 1, {type: 'integer'});
            done(error);
        });

        it("should validate null, definition = {type: 'integer', required: false}", function (done) {
            var error = validator.validate("paramName", null, {type: 'integer', required: false});
            done(error);
        });

        it("should validate undefined, definition = {type: 'integer', required: false}", function (done) {
            var error = validator.validate("paramName", undefined, {type: 'integer', required: false});
            done(error);
        });

        it("should return error if not integer (null)", function (done) {
            var error = validator.validate("paramName", null, "integer");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number.");
            done();
        });

        it("should return error if not integer (float)", function (done) {
            var error = validator.validate("paramName", 1.23, "integer");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a integer.");
            done();
        });

        it("should return error if not integer (string number)", function (done) {
            var error = validator.validate("paramName", "123", "integer");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number.");
            done();
        });

        it("should return error if not integer (NaN)", function (done) {
            var error = validator.validate("paramName", NaN, "integer");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number. Got NaN.");
            done();
        });

        it("should return error if not integer (Infinity)", function (done) {
            var error = validator.validate("paramName", Infinity, "integer");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number. Got Infinity.");
            done();
        });

        it("should return error if greater than max", function (done) {
            var error = validator.validate("paramName", 100, {type: 'integer', max: 10});
            assert.ok(error);
            assert.equal(error.message, "paramName should be less than 10.");
            done();
        });

        it("should return error if less than min", function (done) {
            var error = validator.validate("paramName", 100, {type: 'integer', min: 1000});
            assert.ok(error);
            assert.equal(error.message, "paramName should be greater than 1000.");
            done();
        });
    });

    describe("string", function () {

        it("should validate, definition = 'string'", function (done) {
            var error = validator.validate("paramName", "ala", "string");
            done(error);
        });

        it("should validate, definition = String", function (done) {
            var error = validator.validate("paramName", "ala", String);
            done(error);
        });

        it("should validate, definition = {type: 'string'}", function (done) {
            var error = validator.validate("paramName", "ala", {type: 'string'});
            done(error);
        });

        it("should validate, definition = {type: String}", function (done) {
            var error = validator.validate("paramName", "ala", {type: String});
            done(error);
        });

        it("should validate empty string, definition = {type: 'string', empty:true}", function (done) {
            var error = validator.validate("paramName", " ", {type: 'string', empty: true});
            done(error);
        });

        it("should validate null, definition = {type: String, required: false}", function (done) {
            var error = validator.validate("paramName", null, {type: String, required: false});
            done(error);
        });

        it("should validate undefined, definition = {type: String, required: false}", function (done) {
            var error = validator.validate("paramName", undefined, {type: String, required: false});
            done(error);
        });

        it("should return error if not string", function (done) {
            var error = validator.validate("paramName", null, String);
            assert.ok(error);
            assert.equal(error.message, "paramName should be a string.");
            done();
        });

        it("should return error if empty string (default settings)", function (done) {
            var error = validator.validate("paramName", " ", String);
            assert.ok(error);
            assert.equal(error.message, "paramName should be a non-empty string.");
            done();
        });

        it("should return error if empty string, definition = {type: 'string', empty:false}", function (done) {
            var error = validator.validate("paramName", " ", {type: 'string', empty: false});
            assert.ok(error);
            assert.equal(error.message, "paramName should be a non-empty string.");
            done();
        });
    });

    describe("boolean", function () {

        it("should validate, definition = 'boolean'", function (done) {
            var error = validator.validate("paramName", true, "boolean");
            done(error);
        });

        it("should validate, definition = 'bool'", function (done) {
            var error = validator.validate("paramName", true, "bool");
            done(error);
        });

        it("should validate, definition = Boolean", function (done) {
            var error = validator.validate("paramName", true, Boolean);
            done(error);
        });

        it("should validate, definition = {type: 'boolean'}", function (done) {
            var error = validator.validate("paramName", true, {type: 'boolean'});
            done(error);
        });

        it("should validate, definition = {type: 'bool'}", function (done) {
            var error = validator.validate("paramName", true, {type: 'bool'});
            done(error);
        });

        it("should validate, definition = {type: Boolean}", function (done) {
            var error = validator.validate("paramName", true, {type: Boolean});
            done(error);
        });

        it("should validate null, definition = {type: Boolean, required: false}", function (done) {
            var error = validator.validate("paramName", null, {type: Boolean, required: false});
            done(error);
        });

        it("should return error if not boolean", function (done) {
            var error = validator.validate("paramName", null, Boolean);
            assert.ok(error);
            assert.equal(error.message, "paramName should be a boolean.");
            done();
        });
    });

    describe("object", function () {

        it("should validate, definition = 'object'", function (done) {
            var error = validator.validate("paramName", {}, "object");
            done(error);
        });

        it("should validate, definition = Object", function (done) {
            var error = validator.validate("paramName", {}, Object);
            done(error);
        });

        it("should validate, definition = {}", function (done) {
            var error = validator.validate("paramName", {}, {});
            done(error);
        });

        it("should validate, definition = {__obj: true, type: Number}", function (done) {
            var error = validator.validate("paramName", {type: 1}, {__obj: true, type: Number});
            done(error);
        });

        it("should validate null, definition = {type: Object, required: false}", function (done) {
            var error = validator.validate("paramName", null, {type: Object, required: false});
            done(error);
        });

        it("should validate undefined, definition = {type: Object, required: false}", function (done) {
            var error = validator.validate("paramName", undefined, {type: Object, required: false});
            done(error);
        });

        it("should return error if not object", function (done) {
            var error = validator.validate("paramName", null, Object);
            assert.ok(error);
            assert.equal(error.message, "paramName should be an object.");
            done();
        });

        it("should return error if field is invalid, definition = {num: Number}", function (done) {
            var error = validator.validate("paramName", {num: "str"}, {num: Number});
            assert.ok(error);
            assert.equal(error.message, "paramName.num should be a number.");
            done();
        });

        it("should return error if field is invalid, definition = {str: String}", function (done) {
            var error = validator.validate("paramName", {str: 123}, {str: String});
            assert.ok(error);
            assert.equal(error.message, "paramName.str should be a string.");
            done();
        });

        it("should return error if field is invalid, definition = {obj: Object}", function (done) {
            var error = validator.validate("paramName", {obj: 123}, {obj: Object});
            assert.ok(error);
            assert.equal(error.message, "paramName.obj should be an object.");
            done();
        });

        it("should return error if field is invalid, definition = {obj: { }}", function (done) {
            var error = validator.validate("paramName", {obj: 123}, {obj: { }});
            assert.ok(error);
            assert.equal(error.message, "paramName.obj should be an object.");
            done();
        });

        it("should return error if field is invalid, definition = {obj: { num: Number }}", function (done) {
            var error = validator.validate("paramName", {obj: { num: "a" }}, {obj: { num: Number }});
            assert.ok(error);
            assert.equal(error.message, "paramName.obj.num should be a number.");
            done();
        });

        it("should validate, complex definition", function (done) {
            var definition = {
                __obj: true,
                type: {
                    type: "integer",
                    max: 10
                },
                subObj: {
                    street: String,
                    subSubObj: {
                        name: "String",
                        nickname: {
                            type: "String",
                            required: false
                        }
                    }
                }
            };
            var obj = {
                type: 1,
                subObj: {
                    street: "some street name",
                    subSubObj: {
                        name: "john",
                        nickname: null
                    }
                }
            };
            var error = validator.validate("paramName", obj, definition);
            done(error);
        });
    });

    describe("mixed", function () {

        it("should validate number, definition = 'number|string'", function (done) {
            var error = validator.validate("paramName", 1, 'number|string');
            done(error);
        });

        it("should validate string, definition = 'number|string'", function (done) {
            var error = validator.validate("paramName", 'str', 'number|string');
            done(error);
        });

        it("should return error for object, definition = 'number|string'", function (done) {
            var error = validator.validate("paramName", {}, 'number|string');
            assert.ok(error);
            assert.equal(error.message, "paramName should be one of the following types: number, string");
            done();
        });

        it("should validate object, definition = 'number|string|*'", function (done) {
            var error = validator.validate("paramName", {}, 'number|string|*');
            done(error);
        });
    });

    describe("array", function () {

        it("should validate, definition = 'array'", function (done) {
            var error = validator.validate("paramName", [1], 'array');
            done(error);
        });

        it("should validate, definition = Array", function (done) {
            var error = validator.validate("paramName", [1], Array);
            done(error);
        });

        it("should validate, definition = {type: Array}", function (done) {
            var error = validator.validate("paramName", [1], {type: Array});
            done(error);
        });

        it("should validate, definition = {type: 'array'}", function (done) {
            var error = validator.validate("paramName", [1], {type: 'array'});
            done(error);
        });

        it("should validate null, definition = {type: 'array', required: false}", function (done) {
            var error = validator.validate("paramName", null, {type: 'array', required: false});
            done(error);
        });

        it("should validate empty array, definition = {type: 'array', empty: true}", function (done) {
            var error = validator.validate("paramName", [], {type: 'array', empty: true});
            done(error);
        });

        it("should validate, definition = []", function (done) {
            var error = validator.validate("paramName", [1], []);
            done(error);
        });

        it("should validate, definition = [Number]", function (done) {
            var error = validator.validate("paramName", [1], [Number]);
            done(error);
        });

        it("should validate, definition = [Number, String]", function (done) {
            var error = validator.validate("paramName", [1, "str", 1], [Number, String]);
            done(error);
        });

        it("should validate, definition = [[]]", function (done) {
            var error = validator.validate("paramName", [[1], [2, 3, 4]], [[]]);
            done(error);
        });

        it("should return error if not array, definition = Array", function (done) {
            var error = validator.validate("paramName", 12, Array);
            assert.ok(error);
            assert.equal(error.message, "paramName should be an array.");
            done();
        });

        it("should return error if empty array, definition = Array", function (done) {
            var error = validator.validate("paramName", [], Array);
            assert.ok(error);
            assert.equal(error.message, "paramName should be a non-empty array.");
            done();
        });

        it("should return error if element has invalid type, definition = [Number]", function (done) {
            var error = validator.validate("paramName", [1, "str"], [Number]);
            assert.ok(error);
            assert.equal(error.message, "paramName[1] should be a number.");
            done();
        });

        it("should return error if element has invalid type, definition = [{type: Number}, String]", function (done) {
            var error = validator.validate("paramName", ["str", 1, false], [
                {type: Number},
                String
            ]);
            assert.ok(error);
            assert.equal(error.message, "paramName[2] should be one of the following types: number, string.");
            done();
        });
    });

    describe("enum", function () {
        it("should validate, definition = {'enum': ['DOG', 'CAT']}", function (done) {
            var error = validator.validate("paramName", 'CAT', {'enum': ['DOG', 'CAT']});
            done(error);
        });

        it("should validate, definition = {'enum': ['DOG', 'CAT'], ignoreCase: true}", function (done) {
            var error = validator.validate("paramName", 'cat', {'enum': ['DOG', 'CAT'], ignoreCase: true});
            done(error);
        });

        it("should validate null, definition = {'enum': ['DOG', 'CAT'], required: false}", function (done) {
            var error = validator.validate("paramName", null, {'enum': ['DOG', 'CAT'], required: false});
            done(error);
        });

        it("should return error if not string, definition = {'enum': ['DOG', 'CAT']}", function (done) {
            var error = validator.validate("paramName", 1, {'enum': ['DOG', 'CAT']});
            assert.ok(error);
            assert.equal(error.message, "paramName should be a string.");
            done();
        });

        it("should return error if not valid enum, definition = {'enum': ['DOG', 'CAT']}", function (done) {
            var error = validator.validate("paramName", 'bird', {'enum': ['DOG', 'CAT']});
            assert.ok(error);
            assert.equal(error.message, "paramName should be an enum value: DOG, CAT");
            done();
        });

        it("should return error if invalid case, definition = {'enum': ['DOG', 'CAT']}", function (done) {
            var error = validator.validate("paramName", 'dog', {'enum': ['DOG', 'CAT']});
            assert.ok(error);
            assert.equal(error.message, "paramName should be a case-sensitive enum value: DOG, CAT");
            done();
        });
    });

    describe("register alias", function () {
        var customValidator;

        beforeEach(function (done) {
            customValidator = new Validator();
            var definition = {
                limit: {type: 'number', min: 0},
                skip: {type: Number, min: 0},
                order: {"enum": ["DESC", "ASC"]}
            };
            customValidator.registerAlias("SearchCriteria", definition);
            done();
        });

        it("should validate, definition = 'SearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: 0,
                order: "ASC"
            };
            var error = customValidator.validate("paramName", obj, "SearchCriteria");
            done(error);
        });

        it("should return error if limit is invalid, definition = 'SearchCriteria'", function (done) {
            var obj = {
                limit: 'asd',
                skip: 0,
                order: "ASC"
            };
            var error = customValidator.validate("paramName", obj, 'SearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.limit should be a number.");
            done();
        });

        it("should return error if skip is invalid, definition = 'SearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: -1,
                order: "ASC"
            };
            var error = customValidator.validate("paramName", obj, 'SearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.skip should be greater than 0.");
            done();
        });

        it("should return error if skip is invalid, definition = 'SearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: 1,
                order: "xxx"
            };
            var error = customValidator.validate("paramName", obj, 'SearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.order should be an enum value: DESC, ASC");
            done();
        });
    });

    describe("register multiple aliases", function () {
        var customValidator;

        beforeEach(function (done) {
            customValidator = new Validator();
            var orderDefinition = {"enum": ["DESC", "ASC"]};
            var positiveInteger = {type: 'integer', min: 0};
            var searchCriteriaDefinition = {
                limit: 'positive-integer',
                skip: 'positive-integer',
                order: "order"
            };
            customValidator.registerAlias("order", orderDefinition);
            customValidator.registerAlias("positive-integer", positiveInteger);
            customValidator.registerAlias("SearchCriteria", searchCriteriaDefinition);
            done();
        });

        it("should validate, definition = 'SearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: 0,
                order: "ASC"
            };
            var error = customValidator.validate("paramName", obj, "SearchCriteria");
            done(error);
        });

        it("should return error if limit is invalid, definition = 'SearchCriteria'", function (done) {
            var obj = {
                limit: 'asd',
                skip: 0,
                order: "ASC"
            };
            var error = customValidator.validate("paramName", obj, 'SearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.limit should be a number.");
            done();
        });

        it("should return error if skip is invalid, definition = 'SearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: -1,
                order: "ASC"
            };
            var error = customValidator.validate("paramName", obj, 'SearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.skip should be greater than 0.");
            done();
        });

        it("should return error if skip is invalid, definition = 'SearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: 1,
                order: "xxx"
            };
            var error = customValidator.validate("paramName", obj, 'SearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.order should be an enum value: DESC, ASC");
            done();
        });
    });


    describe("register alias with extend", function () {
        var customValidator;

        beforeEach(function (done) {
            customValidator = new Validator();
            var searchCriteriaDefinition = {
                limit: {type: 'number', min: 0},
                skip: {type: Number, min: 0},
                order: {"enum": ["DESC", "ASC"]}
            };
            var userSearchCriteria = {
                name: String
            };
            customValidator.registerAlias("SearchCriteria", searchCriteriaDefinition);
            customValidator.registerAliasWithExtend("SearchCriteria", "UserSearchCriteria", userSearchCriteria);
            done();
        });

        it("should validate, definition = 'UserSearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: 0,
                order: "ASC",
                name: "a"
            };
            var error = customValidator.validate("paramName", obj, "UserSearchCriteria");
            done(error);
        });

        it("should return error if limit is invalid, definition = 'UserSearchCriteria'", function (done) {
            var obj = {
                limit: 'asd',
                skip: 0,
                order: "ASC",
                name: "a"
            };
            var error = customValidator.validate("paramName", obj, 'UserSearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.limit should be a number.");
            done();
        });

        it("should return error if skip is invalid, definition = 'UserSearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: -1,
                order: "ASC",
                name: "a"
            };
            var error = customValidator.validate("paramName", obj, 'UserSearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.skip should be greater than 0.");
            done();
        });

        it("should return error if skip is invalid, definition = 'UserSearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: 1,
                order: "xxx",
                name: "a"
            };
            var error = customValidator.validate("paramName", obj, 'UserSearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.order should be an enum value: DESC, ASC");
            done();
        });

        it("should return error if name is invalid, definition = 'UserSearchCriteria'", function (done) {
            var obj = {
                limit: 1,
                skip: 1,
                order: "ASC",
                name: 1
            };
            var error = customValidator.validate("paramName", obj, 'UserSearchCriteria');
            assert.ok(error);
            assert.equal(error.message, "paramName.name should be a string.");
            done();
        });
    });

});

