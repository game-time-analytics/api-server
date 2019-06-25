'use strict';

/**
 * @module model-finder
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {function} next - calls the next middleware
 * @desc middleware that sets up correct pathing
 */
module.exports = (req,res,next) => {
  let modelName = req.params.model.replace(/[^a-z0-9-_]/gi, '');
  req.model = require(`../models/${modelName}/${modelName}-model.js`);
  next();
};
