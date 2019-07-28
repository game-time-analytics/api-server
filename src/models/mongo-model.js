'use strict';

/**
* @module src/models/mongo-model
*/

/**
 * @Class Mongo Model
 * @desc Mongo model for get, post, put, and delete requests
 */

class Model {

  /**
   * @method constructor
   * @param {players} schema - schema for players
   * @param {roles} schema - schema for roles
   */

  constructor(schema) {
    this.schema = schema;
  }

  /**
   * @method get
   * @param {string} _id - Id for specific entries
   * @desc Get one or all items from database
   */

  get(_id) {
    let queryObject = _id ? {_id} : {};
    return this.schema.find(queryObject);
  }
  
  /**
   * @method post
   * @param {string} record - information for what should be added
   * @desc Add an item to the database
   */

  post(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }

  /**
   * @method put
   * @param {string} _id - Id for specific entries
   * @param {string} record - information for what should be added/changed
   * @desc Modify one item in database
   */

  put(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, {new:true});
  }

  /**
   * @method delete
   * @param {string} _id - Id for specific entries
   * @desc Delete an item out of database
   */

  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }

}

/**
 * Export object
 * @type {Object}
 */

module.exports = Model;