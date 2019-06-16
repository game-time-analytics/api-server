'use strict';

const uuid = require('uuid/v4');

/**
 * @Class Memory Model
 * @desc generic memory class model for sanitize, count, get, post, put, and delete requests to database 
 */
class Model {

  /**
   * @constructor
   * @param {object} schema
   * @desc class that creates the general schema and an empty database 
   */

  constructor(schema) {
    this.schema = schema;
    this.database = [];
  }

  /**
   * @method sanitize
   * @param {object} entry - entry to be sanitized
   * @desc sanitizes entry
   */

  sanitize(entry) {

    let valid = true;
    let record = {};

    Object.keys(this.schema).forEach( field => {
      if ( this.schema[field].required ) {
        if (entry[field]) {
          record[field] = entry[field];
        } else {
          valid = false;
        }
      }
      else {
        record[field] = entry[field];
      }
    });
    
    return valid ? record : undefined;
  }
  

  /**
   * @method count
   * @desc keeps track of entries in database
   */
  count() {
    return this.database.length;
  }

  /**
   * @method get
   * @param {string} id 
   * @desc gets all records or one record from database
   */
  get(id) {
    const records = id ? this.database.filter( (record) => record._id === id ) : this.database;
    return Promise.resolve(records);
  }

  /**
   * @method post
   * @param {string} entry
   * @desc adds an item to the database 
   */
  post(entry) {
    entry._id = uuid();
    let record = this.sanitize(entry);
    if ( record._id ) { this.database.push(record); }
    return Promise.resolve(record);
  }

  /**
   * @method delete
   * @param {string} id 
   * @desc deletes an item from the database
   */

  delete(id) {
    this.database = this.database.filter((record) => record._id !== id );
    return this.get(id);
  }

  /**
   * @method put
   * @param {string} id 
   * @param {string} entry - entry to be updated
   * @desc updates an item in database
   */
  put(id, entry) {
    let record = this.sanitize(entry);
    if( record._id ) { this.database = this.database.map((item) => (item._id === id) ? record : item  ); }
    return this.get(id);
  }
  
}

module.exports = Model;