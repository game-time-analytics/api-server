'use strict';

const User = require('../auth/users-model');

module.exports = (capability) => {
  
  return (req, res, next) => {
    const _authBasic = require('./mwModularized/authBasic');
    const _authBearer = require('./mwModularized/authBearer');
    const _authError = require('./mwModularized/authError');

    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);

      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString, capability);
      case 'bearer':
        return _authBearer(authString,capability);
      default:
        return _authError();
      }
    } catch (e) {
      _authError();
    }
  };
  
};