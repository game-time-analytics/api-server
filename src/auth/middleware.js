'use strict';

/**
 * middleware Module
 * @module src/auth/middleware
 */

/**
 * Export object for authentication module
 * @type {Object}
 * @desc allows use of authentication
 */
module.exports = (capability) => {
  
  //check if capabilities is undefined
  if(!capability){
    capability = 'read';
  }

  /**
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} capability - capablities object
   * @param {function} next - next function which calls next middleware
   * @return {object} authenticated user with token
   * @desc Runs all authentication middleware functions depending on type of authorization, basic or bearer
   */

  const utils = require('./utils/index');
  return (req, res, next) => {

    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);
      
      switch (authType.toLowerCase()) {
      case 'basic':
        return utils._authBasic(req, authString, capability, next);
      case 'bearer':
        return utils._authBearer(req, authString, capability, next);
      default:
        return utils._authError(next);
      }
    } catch (e) {
      utils._authError(next);
    }
  };
};

