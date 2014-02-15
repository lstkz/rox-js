"use strict";

var once = require("../lib/once");


function getUser(userId, callback) {
    if (userId === 0) {
        callback(new Error("userId can't be zero"));
        //missing return here!
    }

    callback(null, {username: "user1"});
}


var wrapped = once(getUser, {signature: "getUser"});

wrapped(0, function () {
    console.log(arguments);
});