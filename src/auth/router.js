'use strict';

const express = require('express');
const authRouter = express.Router();
const newRouter = express.Router();

const User = require('../auth/users-model');
const Role = require('../auth/roles-model');
const auth = require('../auth/middleware');
const oauth = require('../auth/oauth/google');

authRouter.post('/role', (req, res, next) => {
  let role = new Role(req.body);

  role.save()
    .then(result => {
      res.status(200).send(result); //Creates a new role at /role and that role
    })
    .catch(next);
});



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

authRouter.get('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

authRouter.post('/key', auth, (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

module.exports = authRouter;
