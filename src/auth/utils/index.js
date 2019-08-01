'use strict';

/**
 * Utils Module
 * @module src/auth/utils/index
 */

/**
 * utils export
 * @type {Object}
 * @desc exports utils functions
 */

let utils = module.exports = {};

const User = require('../users-model');

/**
 * @method _authBearer
 * @param {object} req - request
 * @param {object} authString - user object containing user credentials
 * @param {object} capability - capabilities
 * @param {function} next - next function which calls next middleware
 * @return {object} authenticated user with token
 * @desc Verifies the token matches a user and calls the function authenticate to check the user has the appropriate capabilities for the request
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
 * @param {function} next - next function which calls next middleware
 * @return {object} authenticated user object
 * @desc Handles creating auth information and calls User.authenticateBasic and handles the return
 */

utils._authBasic = function(req, str, capability, next) {
  console.log(req.headers);  //to access basic auth string when using postman
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
 * @param {function} next - next function which calls next middleware
 * @return {object} generates a token based on user capabilities
 * @desc method to verify user has appropriate capabilities and modifies the request object with a user object and a new token
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
 * @param {function} next - next function which calls next middleware
 * @desc Handles all auth errors
 * @return {string} error message
 */

utils._authError = function(next) {
  next('Invalid User ID/Password');
};