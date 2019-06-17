'use strict';

/**
 * @desc Sends error message for invalid log-ins
 */

function _authError() {
  return(req, res, next) =>{
    next('Invalid User ID/Password');
  };
}

module.exports =_authError;