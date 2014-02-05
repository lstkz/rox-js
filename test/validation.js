
"use strict";
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require('chai').assert;
var async = require('async');

var validate = require("../lib/validation").validate;

describe('Validation', function () {

    describe('number', function () {

        it("should validate, definition = 'number'", function (done) {
            var error = validate("paramName", 1, "number");
            done(error);
        });

        it("should validate float, definition = 'number'", function (done) {
            var error = validate("paramName", 1.12, "number");
            done(error);
        });

        it("should validate, definition = Number", function (done) {
            var error = validate("paramName", 1, Number);
            done(error);
        });

        it("should validate, definition = {type: 'number'}", function (done) {
            var error = validate("paramName", 1, {type: 'number'});
            done(error);
        });

        it("should validate, definition = {type: Number}", function (done) {
            var error = validate("paramName", 1, {type: Number});
            done(error);
        });

        it("should validate null, definition = {type: Number, required: false}", function (done) {
            var error = validate("paramName", null, {type: Number, required: false});
            done(error);
        });

        it("should validate undefined, definition = {type: Number, required: false}", function (done) {
            var error = validate("paramName", undefined, {type: Number, required: false});
            done(error);
        });

        it("should return error if not number (null)", function (done) {
            var error = validate("paramName", null, "number");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number.");
            done();
        });

        it("should return error if not number (string number)", function (done) {
            var error = validate("paramName", "123", "number");
            assert.ok(error);
            assert.ok(error);
            done();
        });

        it("should return error if not number (NaN)", function (done) {
            var error = validate("paramName", NaN, "number");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number. Got NaN.");
            done();
        });

        it("should return error if not number (Infinity)", function (done) {
            var error = validate("paramName", Infinity, "number");
            assert.equal(error.message, "paramName should be a number. Got Infinity.");
            assert.ok(error);
            done();
        });

        it("should return error if greater than max", function (done) {
            var error = validate("paramName", 100, {type: 'number', max: 10});
            assert.ok(error);
            assert.equal(error.message, "paramName should be less than 10.");
            done();
        });

        it("should return error if less than min", function (done) {
            var error = validate("paramName", 100, {type: 'number', min: 1000});
            assert.ok(error);
            assert.equal(error.message, "paramName should be greater than 1000.");
            done();
        });
    });

    describe('integer', function () {
        it("should validate, definition = 'integer'", function (done) {
            var error = validate("paramName", 1, "integer");
            done(error);
        });

        it("should validate, definition = {type: 'integer'}", function (done) {
            var error = validate("paramName", 1, {type: 'integer'});
            done(error);
        });

        it("should validate null, definition = {type: 'integer', required: false}", function (done) {
            var error = validate("paramName", null, {type: 'integer', required: false});
            done(error);
        });

        it("should validate undefined, definition = {type: 'integer', required: false}", function (done) {
            var error = validate("paramName", undefined, {type: 'integer', required: false});
            done(error);
        });

        it("should return error if not integer (null)", function (done) {
            var error = validate("paramName", null, "integer");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number.");
            done();
        });

        it("should return error if not integer (float)", function (done) {
            var error = validate("paramName", 1.23, "integer");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a integer.");
            done();
        });

        it("should return error if not integer (string number)", function (done) {
            var error = validate("paramName", "123", "integer");
            assert.ok(error);
            assert.ok(error);
            done();
        });

        it("should return error if not integer (NaN)", function (done) {
            var error = validate("paramName", NaN, "integer");
            assert.ok(error);
            assert.equal(error.message, "paramName should be a number. Got NaN.");
            done();
        });

        it("should return error if not integer (Infinity)", function (done) {
            var error = validate("paramName", Infinity, "integer");
            assert.equal(error.message, "paramName should be a number. Got Infinity.");
            assert.ok(error);
            done();
        });

        it("should return error if greater than max", function (done) {
            var error = validate("paramName", 100, {type: 'integer', max: 10});
            assert.ok(error);
            assert.equal(error.message, "paramName should be less than 10.");
            done();
        });

        it("should return error if less than min", function (done) {
            var error = validate("paramName", 100, {type: 'integer', min: 1000});
            assert.ok(error);
            assert.equal(error.message, "paramName should be greater than 1000.");
            done();
        });
    });

    describe("string", function () {

        it("should validate, definition = 'string'", function (done) {
            var error = validate("paramName", "ala", "string");
            done(error);
        });

        it("should validate, definition = String", function (done) {
            var error = validate("paramName", "ala", String);
            done(error);
        });

        it("should validate, definition = {type: 'string'}", function (done) {
            var error = validate("paramName", "ala", {type: 'string'});
            done(error);
        });

        it("should validate, definition = {type: String}", function (done) {
            var error = validate("paramName", "ala", {type: String});
            done(error);
        });

        it("should validate empty string, definition = {type: 'string', empty:true}", function (done) {
            var error = validate("paramName", " ", {type: 'string', empty: true});
            done(error);
        });

        it("should validate null, definition = {type: String, required: false}", function (done) {
            var error = validate("paramName", null, {type: String, required: false});
            done(error);
        });

        it("should validate undefined, definition = {type: String, required: false}", function (done) {
            var error = validate("paramName", undefined, {type: String, required: false});
            done(error);
        });

        it("should return error if not string", function (done) {
            var error = validate("paramName", null, String);
            assert.ok(error);
            assert.equal(error.message, "paramName should be a string.");
            done();
        });

        it("should return error if empty string (default settings)", function (done) {
            var error = validate("paramName", " ", String);
            assert.ok(error);
            assert.equal(error.message, "paramName should be a non-empty string.");
            done();
        });

        it("should return error if empty string, definition = {type: 'string', empty:false}", function (done) {
            var error = validate("paramName", " ", {type: 'string', empty: false});
            assert.ok(error);
            assert.equal(error.message, "paramName should be a non-empty string.");
            done();
        });
    });

    describe("object", function () {

        it("should validate, definition = 'object'", function (done) {
            var error = validate("paramName", {}, "object");
            done(error);
        });

        it("should validate, definition = Object", function (done) {
            var error = validate("paramName", {}, Object);
            done(error);
        });

        it("should validate, definition = {}", function (done) {
            var error = validate("paramName", {}, {});
            done(error);
        });

        it("should validate null, definition = {type: Object, required: false}", function (done) {
            var error = validate("paramName", null, {type: Object, required: false});
            done(error);
        });

        it("should validate undefined, definition = {type: Object, required: false}", function (done) {
            var error = validate("paramName", undefined, {type: Object, required: false});
            done(error);
        });
    });
});

