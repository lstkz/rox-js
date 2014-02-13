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
validator.registerAlias("userRole", ["admin", "superadmin", "user", "manager"]);

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
