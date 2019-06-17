'use strict';

const express = require('express');
const newRouter = express.Router();
const authRouter = require('../auth/router');
const Role = require('../auth/roles-model');

const User = require('../auth/users-model');
const auth = require('../auth/middleware');

const capabilities = {
  admin: ['create','read','update','delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

/**
 * post route for /role
 * @route POST /{model}/
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
authRouter.post('/role', () => {
  let saves = [];

  Object.keys(capabilities).map(role => {
    let newRecord = new Role({role, capabilities: capabilities[role]});
    saves.push(newRecord.save);
  });

  // run them all
  Promise.all(saves);
});

newRouter.get('/public-stuff', (req, res, next) => {
  res.status(200).send('In the public stuff route');
});

newRouter.get('/hidden-stuff', auth, (req, res, next) => {
  res.status(200).send('In the hidden stuff route');
});

newRouter.get('/something-to-read', auth('read'), (req, res, next) => {
  res.status(200).send('In the something-to-read route');
});

newRouter.post('/create-a-thing', auth('create'), (req, res, next) => {
  res.status(200).send('In the create-a-thing route');
});

newRouter.put('/update', auth('update'), (req, res, next) => {
  res.status(200).send('In the update route');
});

newRouter.put('/jp', auth('update'), (req, res, next) => {
  res.status(200).send('In the jp route');
});

newRouter.delete('/bye-bye', auth('delete'), (req, res, next) => {
  res.status(200).send('In the bye-bye route');
});

newRouter.get('/everything', auth('delete'), (req, res, next) => {
  res.status(200).send('In the everything route');
});

module.exports = newRouter;