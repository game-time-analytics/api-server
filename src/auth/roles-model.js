'use strict';

/**
 * roles-model Module
 * @module src/auth/roles-model
 */

const mongoose = require('mongoose');

/**
 * Roles Schema for creating roles
 * @method rolesSchema
 * @param {string} role - role
 * @param {array} capabilities - capabilities available to selected role
 * @desc Handles roles
 */

const rolesSchema = new mongoose.Schema({
  role: {type: String, required:true},
  capabilities: {type: Array, required:true},
});

/**
 * Export object for roles schema
 * @type {Object}
 * @desc allows use of roles schema
 */
module.exports = mongoose.model('roles', rolesSchema);