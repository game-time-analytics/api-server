'use strict';

const Model = require('../mongo-model.js');
const schema = require('./teams-schema.js');

/**
 * @class Teams
 * @desc Teams class which is inherited from the Model Class
 */
class Teams extends Model {}

module.exports = new Teams(schema);

