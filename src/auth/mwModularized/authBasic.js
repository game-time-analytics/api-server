'use strict';

const User = require('../users-model');
const _authenticate = require('../mwModularized/auth');
const _authError = require('../mwModularized/authError');


/**
 * 
 * @param {object} authString 
 * @desc Helps create the authentification info and returns parsed out info
 */
function _authBasic(str, capability) {
  // str: am9objpqb2hubnk=
  let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
  let bufferString = base64Buffer.toString();    // john:mysecret
  let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
  let auth = {username, password}; // { username:'john', password:'mysecret' }

  return User.authenticateBasic(auth)
    .then(user => _authenticate(user))
    .catch(_authError);
}

module.exports = _authBasic;