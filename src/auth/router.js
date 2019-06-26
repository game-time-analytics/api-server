'use strict';

/**
 * API Router Module
 * @module src/auth/router
 */

const express = require('express');
const authRouter = express.Router();
const Role = require('./roles-model.js');
const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');

/**
 * post route assign role
 * @route POST /{role}
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

// To create roles visit this route once
const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

authRouter.post('/role', (req, res) => {

  let saves = [];
  Object.keys(capabilities).map(role => {
    let newRecord = new Role({role, capabilities: capabilities[role]});
    saves.push(newRecord.save());
  });

  Promise.all(saves);

  res.status(200).send('Roles created');
});

/**
 * signup user
 * @route POST /{signup}
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

/**
 * signin user
 * @route GET /{signin}
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

authRouter.get('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

/**
 * Modifies of records for model provided
 * @route PUT /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
authRouter.put('/update/:id', auth('update'), handlePut);


/**
 * Deletes records for model provided
 * @route DELETE /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { }
 */
authRouter.delete('/delete/:id', auth('delete'), handleDelete);

/**
   * @function handlePut
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - next function which calls next middleware
   * @desc Middleware that handles put route
   */
function handlePut(req,res,  next) {
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(() => res.status(200).send('Information updated'))
    .catch(next);
}
  
/**
     * @function handleDelete
     * @param {object} request - request object
     * @param {object} response - response object
     * @param {function} next - next function which calls next middleware
     * @desc Middleware that handles delete route
     */
function handleDelete(req, res, next) {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).send('Information deleted'))
    .catch(next);
}

/**
 * oauth user
 * @route GET /{oauth}
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

/**
 * Save key
 * @route POST /{model}
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

authRouter.post('/key', auth(), (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

/**
 * Export object with authrouter
 * @type {Object}
 */

module.exports = authRouter;