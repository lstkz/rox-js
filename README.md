Utilities for validation, logging, caching and more. 
==============================
This module is not implemented yet. Below examples are just planning features.


Validation
-----

old way to do validation

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

