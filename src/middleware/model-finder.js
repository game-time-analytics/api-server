'use strict';

/**
 * @module src/middleware/model-finder
 */

/**
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - calls next middleware
   * @desc Middleware that gets modelnames for pathing
   */
  
module.exports = (req,res,next) => {
  console.log('In model finder');
  let modelName = req.params.model.replace(/[^a-z0-9-_]/gi, '');
  req.model = require(`../models/${modelName}/${modelName}-model.js`);
  next();
};