"use strict";

var timeout = require("../lib/timeout");


function getUser(userId, callback) {
    if (userId === 1) {
        callback(null, {username: "user1"});
    } else if (userId === 2) {
        callback(null, {username: "user2"});
    }
    //unhandled code
}


var wrapped = timeout(getUser, {signature: "getUser", timeout: 1000});

wrapped(3, function () {
    console.log(arguments);
});