'use strict';

/**
 * @Class Mongo Model
 * @desc generic mongo class model for get, post, put, and delete requests to database 
 */

class Model {
/**
 * 
 * @param {string} schema - schema for players, teams and categories
 */
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * @method get
   * @param {string} _id 
   * @desc Gets one item from the database
   */

  get(_id) {
    let queryObject = _id ? {_id} : {};
    return this.schema.find(queryObject);
  }

  /**
   * @method post
   * @param {string} record - contains information for what is being created
   * @desc adds an item to the database
   */
  
  post(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }

  /**
   * @method put
   * @param {string} _id 
   * @param {string} record - contains information for what is being created
   * @desc updated an item in the database
   */

  put(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, {new:true});
  }
  
  /**
   * @method delete
   * @param {string} _id 
   * @desc deletes an item from the database
   */

  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }

}

module.exports = Model;
