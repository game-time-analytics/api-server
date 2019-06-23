'use strict';

/**
 * API Router Module (V1)
 * Integrates with v1rious models through a common Interface (.get(), .post(), .put(), .delete())
 * @module src/api/v1
 */

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);
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
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
router.post('/api/v1/:model', auth('create'), handlePost);

/**
 * Get a list of records for model id provided
 * @route GET /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
router.get('/api/v1/:model/:id', handleGetOne);

/**
 * Modifies of records for model provided
 * @route PUT /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
router.put('/api/v1/:model/:id', auth('update'), handlePut);

/**
 * Modifies of records for model provided
 * @route patch /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
router.patch('/api/v1/:model/:id', auth('update'), handlePut);

/**
 * Deletes records for model provided
 * @route DELETE /{model}/{id}
 * @param {string} model.path.required - Resource model name
 * @param {number} id.path.required - Resource model name
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
router.delete('/api/v1/:model/:id', auth('delete'), handleDelete);

// Route Handlers

/**
   * @function handleGetAll
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - next function which calls next middleware
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
   * @param {function} next - next function which calls next middleware
   * @desc Middleware that handles get one route call
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
   * @param {function} next - next function which calls next middleware
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
   * @param {function} next - next function which calls next middleware
   * @desc Middleware that handles put route
   */
function handlePut(request,response,next) {
  request.model.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
   * @function handlePut
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - next function which calls next middleware
   * @desc Middleware that handles delete route
   */
function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;