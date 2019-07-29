'use strict';

const Model = require('../mongo-model');
const schema = require('./players-schema');

/**
 * @module src/models/players/players-model
 */

/**
 * @Class Players Model
 * @property {class} - class extends from model
 */

class Players extends Model {}

/**
 * Export object
 * @type {Object}
 */

module.exports = new Players(schema);
