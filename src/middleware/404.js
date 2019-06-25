'use strict';

/**
 * @module 404
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @desc client error  
 */
module.exports = (req,res,next) => {
  let error = { error: 'Resource Not Found' };
  res.status(404).json(error).end();
};
