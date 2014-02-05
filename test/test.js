
"use strict";
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require('chai').assert;
var async = require('async');
var winston = require("winston");
winston.remove(winston.transports.Console);

describe('Rox', function () {
    var wrap = require('../lib/rox').wrap;
    var fun, meta;

    beforeEach(function (done) {
        fun = function (a, b, callback) {
            callback(null, a + b);
        };
        meta = {
            signature: "TestMethod",
            input: {
                a: Number,
                b: Number
            },
            output: {
                sum: Number
            }
        };
        fun._rox = meta;
        done();
    });

    describe("wrap()", function () {

        it("should throw error if fn is not function", function (done) {
            try {
                wrap(1);
            } catch (e) {
                assert.ok(e);
                assert.equal(e.message, "fn should be a function");
                done();
            }
        });

        it("should throw error if _rox is not object", function (done) {
            try {
                wrap(function () {
                });
            } catch (e) {
                assert.equal(e.message, "_rox should be an object");
                done();
            }
        });

        it("should throw error if _rox.input is not object", function (done) {
            try {
                delete meta.input;
                wrap(fun);
            } catch (e) {
                assert.equal(e.message, "_rox.input should be an object");
                done();
            }
        });

        it("should throw error if _rox.output is not object", function (done) {
            try {
                delete meta.output;
                wrap(fun);
            } catch (e) {
                assert.equal(e.message, "_rox.output should be an object");
                done();
            }
        });

        it("should throw error if _rox.signature is not string", function (done) {
            try {
                delete meta.signature;
                wrap(fun);
            } catch (e) {
                assert.equal(e.message, "_rox.signature should be a string");
                done();
            }
        });
    });

    describe("parameter existence", function () {
        it("should throw error if callback is missing", function (done) {
            var fn = wrap(fun);
            try {
                fn(1, 2);
            } catch (e) {
                assert.ok(e);
                done();
            }
        });

        it("should throw error if callback is not a function", function (done) {
            var fn = wrap(fun);
            try {
                fn(1, 2, {});
            } catch (e) {
                assert.ok(e);
                done();
            }
        });

        it("should throw error if parameter count is invalid", function (done) {
            var fn = wrap(fun);
            try {
                fn(function () {
                    done(new Error('callback shouldnt be called'));
                });
            } catch (e) {
                assert.ok(e);
                done();
            }
        });
    });

    describe("callback parameter existence", function () {

        it("should return result successfully", function (done) {
            var fn = wrap(fun);
            fn(1, 2, function (err, sum) {
                if (err) {
                    done(err);
                    return;
                }
                assert.equal(3, sum);
                done();
            });
        });

        it("should return error in callback", function (done) {
            fun = function (a, b, callback) {
                callback(new Error("fake error"));
            };
            fun._rox = meta;
            var fn = wrap(fun);
            fn(1, 2, function (err) {
                assert.ok(err);
                assert.equal(err.message, "fake error");
                done();
            });
        });

        it("should return error if callback is missing required parameters", function (done) {
            fun = function (a, b, callback) {
                callback();
            };
            fun._rox = meta;
            var fn = wrap(fun);
            fn(1, 2, function (err) {
                assert.ok(err);
                assert.equal(err.message, "Missing callback parameter(s): sum");
                done();
            });
        });

        it("should return error if callback is missing required parameters (passed null as error)", function (done) {
            fun = function (a, b, callback) {
                callback(null);
            };
            fun._rox = meta;
            var fn = wrap(fun);
            fn(1, 2, function (err) {
                assert.ok(err);
                assert.equal(err.message, "Missing callback parameter(s): sum");
                done();
            });
        });

        it("should return error if too many parameters are returned in callback", function (done) {
            fun = function (a, b, callback) {
                callback(null, 1, 2);
            };
            fun._rox = meta;
            var fn = wrap(fun);
            fn(1, 2, function (err) {
                assert.ok(err);
                assert.equal(err.message, "Too many callback parameters");
                done();
            });
        });

    });
});