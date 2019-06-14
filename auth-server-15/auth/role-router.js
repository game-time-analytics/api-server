'use strict';

const express = require('express');
const newRouter = express.Router();

const User = require('./users-model');
const auth = require('./middleware');

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