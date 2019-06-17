'use strict';

const User = require('../users-model');
const _authenticate = require('../mwModularized/auth');
const _authError = require('../mwModularized/authError');

/**
 * 
 * @param {object} authString 
 * @param {object} capability
 * @desc  Authenticates a user via token and moves to the authenticate helper function
 */

module.exports = (authString, capability) => {
  return User.authenticateToken(authString)
    .then(user => _authenticate(user, capability))
    .catch(_authError);
};


// function _authBearer(authString, capability) {
//   return User.authenticateToken(authString)
//     .then(user => _authenticate(user))
//     .catch(_authError);
// }

// module.exports = _authBearer;