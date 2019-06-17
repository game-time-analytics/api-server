'use strict';

const express = require('express');
const authRouter = express.Router();
// const newRouter = express.Router();

const User = require('../auth/users-model');
const Role = require('../auth/roles-model');
const auth = require('../auth/middleware');
const oauth = require('../auth/oauth/google');

/**
 * @method POST /{role}
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, [{}, {}] }
 * @desc creates new role for a user
 * 
 */

authRouter.post('/role', (req, res, next) => {
  let role = new Role(req.body);

  role.save()
    .then(result => {
      res.status(200).send(result); //Creates a new role at /role and that role
    })
    .catch(next);
});

/**
 * @method POST /{model}/
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, [{}, {}] }
 * @desc signed up a new user
 */

authRouter.post('/signup', (req, res, next) => {
  console.log('In the signup route');
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
 * @method GET /{model}/
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - {count: 2, [{}, {}] }
 * @desc signs in user
 */

authRouter.get('/signin', auth(), (req, res, next) => {
  console.log('In the signin route');
  res.cookie('auth', req.token);
  res.send(req.token);
});

/**
 * @method GET /{model}/
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - {count: 2, [{}, {}] }
 * @desc authenticates user via token
 */

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

/**
 * @method POST /{model}/
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - {count: 2, [{}, {}] }
 * @desc generates key
 */

authRouter.post('/key', auth, (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

module.exports = authRouter;
