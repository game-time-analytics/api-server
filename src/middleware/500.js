'use strict';

/**
* @module src/middleware/500
*/

/**
* @method 500
* @param {object} err - the error object
* @param {object} req - request object
* @param {object} res - response object
* @param {Function} next - next function which calls next middleware
* @returns {string} 500 server error
* Export object
* @type {Object}
* @desc server error handler function
*/

module.exports = (err, req, res, next) => {
  let error = { error: err };
  res.status(500).json(error).end();
};
