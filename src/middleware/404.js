'use strict';

/**
* @module src/middleware/404
*/

/**
* @method 404
* @param {object} req - the request object
* @param {object} res - the response object
* @param {Function} next - next function which calls next middleware
* @returns {string} 404 client error
* Export object
* @type {Object}
* @desc client error function handler
*/

module.exports = (req,res,next) => {
  let error = { error: 'Resource Not Found' };
  res.status(404).json(error).end();
};
