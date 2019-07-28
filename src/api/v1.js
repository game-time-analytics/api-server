'use strict';

/**
 * API Router Module (V1)
 * Integrates with various models through a common Interface (.get(), .post(), .put(), .delete())
 * @module src/api/v1
 */

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);
const auth = require(`${cwd}/src/auth/middleware.js`);

const router = express.Router();

// Evaluate the model, dynamically
router.param('model', modelFinder);


/**
 * Get a list of records for model provided
 * @route GET /{model}
 * @param {string} model.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns all of specified model
 */

 
router.get('/api/v1/:model', handleGetAll);

/**
 * Creates a new entry for model provided
 * Require create capability
 * @route POST /{model}
 * @param {string} model.path.required - Resource model name
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - creates new entry for specified model
 */

console.log('in v1.js');
router.post('/api/v1/:model', handlePost);

/**
 * Get a list of records for model id provided
 * @route GET /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns one from specified model dependent on id
 */

router.get('/api/v1/:model/:id', handleGetOne);

/**
 * Updates records for model id provided
 * Requires update capability
 * @route PUT /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - updates one from specified model dependent on id and input params
 */

router.put('/api/v1/:model/:id',auth('update'), handlePut);

/**
 * Updates records for model id provided
 * Requires update capability
 * @route PATCH /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - updates one from specified model dependent on id and input params
 */

router.patch('/api/v1/:model/:id',auth('update'), handlePut);

/**
 * Deletes records for model id provided
 * Requires delete capability
 * @route DELETE /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - If successful returns nothing
 */

router.delete('/api/v1/:model/:id',auth('delete'), handleDelete);

// Route Handlers

/**
   * @function handleGetAll
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - calls next middleware
   * @desc Middleware that handles get all route call
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
   * @function handleGetOne
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - calls next middleware
   * @desc Middleware that handles get one call
   */

function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

/**
   * @function handlePost
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - calls next middleware
   * @desc Middleware that handles post route
   */

function handlePost(request,response,next) {
  request.model.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
   * @function handlePut
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - calls next middleware
   * @desc Middleware that handles put route
   */

function handlePut(request,response,next) {
  request.model.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
   * @function handleDelete
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - calls next middleware
   * @desc Middleware that handles delete route
   */

function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Export object
 * @type {Object}
 */

module.exports = router;