/* eslint-disable indent */
'use strict';

const _authError = require('./authError');

/**
 * 
 * @param {object} user 
 * @desc checks the user's capability and if none is provided gives the user capability by default. Then generates token and moves to the next middleware
 */

function _authenticate(user, capability) {
  return (req, res, next) => {
    if ( user && (!capability || (user.can(capability))) ) { // If capability is undefined and there is nothing passed into the auth middleware, any registered user can go to that route. If a capability is passed in the middleware of create and a user is only has a read capablilty, that user can not access that route 
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  };
}

module.exports = _authenticate;