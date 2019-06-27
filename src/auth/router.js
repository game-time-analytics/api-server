'use strict';

/**
 * Router Module
 * @module src/auth/router
 */

// Dependencies
const express = require('express');
const authRouter = express.Router();
const Role = require('./roles-model.js');
const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');

// Capablities object containing information for each role
const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};
/* istanbul ignore next */
/**
 * Post route to create roles
 * @route POST /{role}
 * @consumes application/json application/xml
 * @param {Object} req - request
 * @param {Object} res - response
 * @returns {Object} 500 - Server error
 * @returns {String} 200 - 'Roles created'
 */

// To create roles visit this route once
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
 * Post route to signup a user
 * @route POST /{signup}
 * @consumes application/json application/xml
 * @param {Object} req - request
 * @param {Object} res - response
 * @param {Function} next - next function which calls next middleware
 * @returns {Object} 500 - Server error
 * @returns {String} 200 - A token containing all user information
 */

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.status(200).send(req.token);
    })
    .catch(next);
});

/**
 * Get route to signin a user
 * @route GET /{signin}
 * @consumes application/json application/xml
 * @param {Object} req - request
 * @param {Object} res - response
 * @param {function} next - next function which calls next middleware
 * @returns {Object} 500 - Server error
 * @returns {String} 200 - A token containing all user information
 */
authRouter.get('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

/**
 * Put route that updates records for user
 * @route PUT /{update}/{id}
 * @param {Number} id.path.required - id of user to be updated
 * @returns {Object} 500 - Server error
 * @returns {String} 200 - 'Information updated'
 */
authRouter.put('/update/:id', auth('update'), handlePut);

/**
 * Function that updates records for user
 * @function handlePut
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function which calls next middleware
 * @returns {string} 200 - 'Information updated'
 * @desc Middleware that handles put route to update user information
 */
  
function handlePut(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(() => res.status(200).send('Information updated'))
    .catch(next);
}

/**
 * Delete route that deletes records for user id provided
 * @route DELETE /{delete}/{id}
 * @param {Number} id.path.required - user id
 * @returns {Object} 500 - Server error
 * @returns {String} 200 - 'Information deleted'
 */
authRouter.delete('/delete/:id', auth('delete'), handleDelete);
  
/**
 * @function handleDelete
 * @param {object} request - request object
 * @param {object} response - response object
 * @param {function} next - next function which calls next middleware
 * @returns {string} 200 - 'Information deleted'
 * @desc Middleware that handles delete route to delete a user
 */

function handleDelete(req, res, next) {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).send('Information deleted'))
    .catch(next);
}

/**
 * Get route to use google oauth
 * @route GET /{oauth}
 * @consumes application/json application/xml
 * @param {Object} req - request
 * @param {Object} res - response
 * @param {function} next - next function which calls next middleware
 * @returns {Object} 500 - Server error
 * @returns {String} 200 - token containing google user information
*/

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});
/* istanbul ignore next */
/**
 * Obtain key that is good for unlimited uses
 * @route POST /{key}
 * @consumes application/json application/xml
 * @param {Object} req - request
 * @param {Object} res - response
 * @param {Function} next - next function which calls next middleware
 * @returns {Object} 500 - Server error
 * @returns {String} 200 - Key represented as a token
 */

authRouter.post('/key', auth(), (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

/**
 * Export object with authrouter
 * @type {Object}
 * @desc exports authrouter
 */

module.exports = authRouter, handleDelete;