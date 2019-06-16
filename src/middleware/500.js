'use strict';

/**
 * @module 500
 * @param {object} err - the error object
 * @param {object} req - request object
 * @param {object} res - response object
 * @desc server error
 */
module.exports = (err, req, res, next) => {
  let error = { error: err };
  res.status(500).json(error).end();
};
