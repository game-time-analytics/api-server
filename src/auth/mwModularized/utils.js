'use strict';

/**
 * Utils Module
 * @module src/auth/mwModularized/utils
 */

/**
 * utils export
 * @type {Object}
 * @desc exports utils functions
 */

let utils = module.exports = {};

const User = require('../users-model');

/**
 *   @method _authBearer
 * @param {object} req - request
 * @param {object} authString - user object containing user credentials
 * @param {object} capability - capabilities
 * @param {object} next - next
 * @desc Handles authenticating a user and moves onto next middleware or returns and error
 */

utils._authBearer = function(req, authString, capability, next) {
  return User.authenticateToken(authString)
    .then(user => utils._authenticate(req, user, capability, next))
    .catch(() => utils._authError(next));
};

/**
 * @method _authBasic
 * @param {object} req - request
 * @param {string} str - string
 * @param {object} capability - capability
 * @param {object} next - next
 * @desc Handles creating auth information and calls User.authenticateBasic and handles the return
 */

utils._authBasic = function(req, str, capability, next) {
  // str: am9objpqb2hubnk=
  let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
  let bufferString = base64Buffer.toString();    // john:mysecret
  let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
  let auth = {username, password}; // { username:'john', password:'mysecret' }
  return User.authenticateBasic(auth)
    .then(user => utils._authenticate(req, user, capability, next))
    .catch(() => utils._authError(next));
};

/**
 * @method _authenticate
 * @param {object} req - request
 * @param {object} user - user object containing user credentials
 * @param {object} capability - capability
 * @param {object} next - next
 * @desc Handles authenticating a user and moves onto next middleware or returns and error
 */

utils._authenticate = function(req, user, capability, next) {
  if ( user && (!capability || (user.can(capability))) ) {
    req.user = user;
    req.token = user.generateToken();
    next();
  }
  else {
    utils._authError(next);
  }
};

/**
 * @method _autheError
 * @param {object} next - next function
 * @desc Handles all auth errors
 */

utils._authError = function(next) {
  next('Invalid User ID/Password');
};