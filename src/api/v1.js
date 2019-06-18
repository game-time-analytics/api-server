'use strict';

/**
 * API Router Module (V1)
 * Integrates with various models through a common Interface (.get(), .post(), .put(), .delete())
 * @module src/api/v1
 */

const cwd = process.cwd();

const express = require('express');

// const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);
const modelFinder = require('../middleware/model-finder');
const auth = require(`${cwd}/src/auth/middleware.js`);


const router = express.Router();

// Evaluate the model, dynamically
router.param('model', modelFinder);


// API Routes

/**
 * Get a list of records for model provided
 * @route GET /{model}
 * @param {string} model.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

router.get('/api/v1/:model', handleGetAll);

/**
 * Creates a list of records for model provided
 * @route POST /{model}
 * @param {string} model.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

router.post('/api/v1/:model', auth('create'), handlePost);


/**
 * Gets a list of records for model id provided
 * @route GET /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
  */

router.get('/api/v1/:model/:id', handleGetOne);

/**
 * Modifies a list of records for model provided
 * @route PUT /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
  */

router.put('/api/v1/:model/:id', auth('update'), handlePut);

/**
 * Modifies a list of records for model provided
 * @route PATCH /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
  */

router.patch('/api/v1/:model/:id', auth('update'), handlePut);

/**
 * Deletes records for model id provided
 * @route GET /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
  */
router.delete('/api/v1/:model/:id', auth('delete'), handleDelete);

// Route Handlers

/**
 * Get a list of records for model provided
 * @route GET /{model}
 * @param {string} model.path.required
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, resultts: [{}, {}]}
 */

 
function handleGetAll(request,response,next) {
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

/**
 * Get one record for model provided
 * @route GET /{model}/{id}
 * @param {string} model.path.required - Model name
 * @param {number} id.path.required - Model id
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, resultts: [{}, {}]}
 */

function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

/**
 * Creates a list of records for model provided
 * @route POST /{model}
 * @param {string} model.path.required - Model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count:2, resultts: [{}, {}]}
 */


function handlePost(request,response,next) {
  request.model.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Updates one record for model provided
 * @route PUT /{model}/{id}
 * @param {string} model.path.required - Model name
 * @param {number} id.path.required - Model id
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, resultts: [{}, {}]}
 */

function handlePut(request,response,next) {
  request.model.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Deletes one record for model provided
 * @route DELETE /{model}/{id}
 * @param {string} model.path.required - Model name
 * @param {number} id.path.required - Model id
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 1, resultts: [ {} ]}
 */

function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;
