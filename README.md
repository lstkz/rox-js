It rox
==============================
**Utilities for validation, logging, caching and more.**  
This module is not implemented yet. Below examples are just planning features.


Validation
-----

Old way to do a validation.

```js
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
```

Usually you create a helper with validation methods. Something in this way.

```js
//using helpers
function searchUsers(searchCriteria) {
    helper.checkObject(searchCriteria, "searchCriteria");
    helper.checkInteger(searchCriteria.offset, "searchCriteria.offset");
    helper.checkInteger(searchCriteria.limit, "searchCriteria.limit");
    helper.checkMinNumber(searchCriteria.offset, 0, "searchCriteria.offset");
    helper.checkMinNumber(searchCriteria.limit, 1, "searchCriteria.limit");
    //..code
}
```


In rox module you will create a validation schema.

```js
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
```
----------

You can create more complex validation rules. It can contain nasted object, arrays and enums.
In below example `roles` are array of enum.
```js
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
```

sample method call
```js
var criteria = {
    offset: 0,
    limit: 10,
    roles: ["admin", "user"],
    address: {
        country: "Poland"
    }
};

var result = searchUsers(criteria);
```
----------
You can define alias, if you use some type often.

```js
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
```


Function logging
-----
old way
```js
function addNumbers(a, b, callback) {
    var inputSerialized = JSON.stringify({input: {a: a, b: b} }), sum, outputSerialized;
    util.log("ENTER addNumbers " + inputSerialized);

    //main application logic goes here
    sum = a + b;

    outputSerialized = JSON.stringify({output: {sum: sum}});
    util.log("EXIT addNumbers " + inputSerialized + ", " + outputSerialized);
    callback(null, sum);
}
```

in rox module we wrap a function
```js

function addNumbers(a, b, callback) {
    callback(null, a + b);
}

var wrappedSum = logging(addNumbers, {signature: "addNumbers", input: ["a", "b"], output: ["sum"]});

wrappedSum(1, 2, function (err, sum) {

});
```

console output will look like
```
info: ENTER addNumbers {"input":{"a":1,"b":2}}
info: EXIT addNumbers {"input":{"a":1,"b":2},"output":{"sum":3},"time":"14ms"}
```

Logging method checks also parameter and callback existence.



Once - ensure that callback is called only once
-----

```js
function getUser(userId, callback) {
    if (userId === 0) {
        callback(new Error("userId can't be zero"));
        //missing return here!
    }

    callback(null, {username: "user1"});
}
```
In above function callback will be called 2 times, because `return` is missing.

method call
```js
var wrapped = once(getUser, {signature: "getUser"});

wrapped(0, function () {
    console.log(arguments);
});

```

console output
```
{ '0': [Error: userId can't be zero] }
error: callback called more than once in getUser
```

Extra callback call is ignored. This information is logged only to the console.

Callback timeout - when callback is never called
-----

```js
function getUser(userId, callback) {
    if (userId === 1) {
        callback(null, {username: "user1"});
    } else if (userId === 2) {
        callback(null, {username: "user2"});
    }
    //unhandled code
}
```
```getUser``` function returns only results when userId is 1 or 2. Otherwise callback is never called.

method call
```
var wrapped = timeout(getUser, {signature: "getUser", timeout: 1000});

wrapped(3, function () {
    console.log(arguments);
});
```

console output
```
error: callback never called in getUser
{ '0': [Error: Callback never called] }
```
Error message is logged to the console and error is passed to the callback.
