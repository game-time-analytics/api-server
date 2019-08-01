'use strict';

/**
 * @module src/auth/users-model
 */


require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('./roles-model.js');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME;
const SECRET = process.env.SECRET;

const usedTokens = new Set();

// Capablities object containing information for each role
const capabilities = {
  admin: ['create','read','update','delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

/**
 * Users schema for creating users
 * @method usersSchema
 * @param {string} username - username
 * @param {string} password - password
 * @param {string} email - email
 * @param {string} role - role
 * @desc Handles creating users
 */

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','editor','user']},
}, { toObject:{virtuals:true}, toJSON:{virtuals:true}});

/**
 * @method virtual
 * @desc Users virtual linking to roles
 */

users.virtual('acl', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
  justOne: true,
});

/**
 * @method pre - findOne
 * @desc Populating the acl table with users roles
 */

users.pre('findOne', function() {
  try{
    this.populate('acl');
  }
  catch(e) {
    console.error('error', e);
  }
});

/**
 * @method pre - save
 * @desc Saves the password to the database hashed with bcrypt
 */

users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => {throw new Error(error);});
});

/**
* @method createFromOauth
* @param {object} googleUser - passed in user info from google
* @returns {object} either logged in user or newly created user
* @desc Create From Oauth function takes in google user info and either logs in or creates a user
*/
users.statics.createFromOauth = function(googleUser) {

  if(! googleUser) { return Promise.reject('Validation Error'); }
  let email = googleUser.email;
  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      return user;
    })
    .catch( error => {
      let username = email;
      let password = 'none';
      let role = 'user';
      return this.create({username, password, email, role});
    });

};

/**
 * @method authenticateToken
 * @param {object} token
 * @returns {string} 'Invalid Token'
 * @returns {string} parsed token id
 * @desc Checks to see if a user has a valid token
 */
users.statics.authenticateToken = function(token) {
  
  if ( usedTokens.has(token ) ) {
    return Promise.reject('Invalid Token');
  }
  
  try {
    let parsedToken = jwt.verify(token, SECRET);
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  } catch(e) { console.log('rejecteds'); throw new Error('Invalid Token'); }
};

/**
 * @method authenticateBasic
 * @param {object} auth
 * @returns {boolean} valid user or invalid user
 * @desc checks to see if the credentials the user put in are correct and in database
 */

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

/**
 * @method comparePassword
 * @param {string} password
 * @returns {boolean} valid password or invalid password
 * @desc Uses the bcrypt module and compares it to the password that was provided to ensure they match
 */

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

/**
 * @method generateToken
 * @param {object} type - type of token, key etc.
 * @returns {string} signed token
 * @desc generates a token based on that users specified role and capabilities
 */

users.methods.generateToken = function(type) {
  let token = {
    username: this.username,
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || this.role || 'user',
  };
  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) { 
    options = { expiresIn: TOKEN_EXPIRE };
  }
  console.log(token.username);
  return jwt.sign(token, SECRET, options);
};

/**
 * @method can
 * @param {object} capability - users capability
 * @desc checks to see if the passed in capablity has a certain role
 */

users.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};

/**
 * @method generateKey
 * @desc generates a key (a token that doesn't expire)
 */

users.methods.generateKey = function() {
  return this.generateToken('key');
};

/**
 * Export object for users schema
 * @type {Object}
 * @desc allows use of users schema and associated functions
 */

module.exports = mongoose.model('users', users);