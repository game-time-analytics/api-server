'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./roles-model.js');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '5m';
const SECRET = process.env.SECRET || 'foobar';

const usedTokens = new Set();

const capabilities = {
  admin: ['create','read','update','delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','editor','user']},
}, { toObject:{virtuals:true}, toJSON:{virtuals:true}});

users.virtual('acl', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
  justOne: true,
});

users.pre('findOne', function() {
  try{
    this.populate('acl');
  }
  catch(e) {
    console.error('error', e);
  }
});



users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => {throw new Error(error);});
});


/**
 * @module createFromOauth()
 * @param {object} googleUser
 * @desc created from the authorized function located in the oauth diretory. Allows google users to sign in with their accounts and then creates that user in the database
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
 * @module authenticateToken()
 * @param {object} token
 * @desc Checks to see if a user has a vaild token
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
 * @module authenticateBasic()
 * @param {object}
 * @desc checks to see if the credientials the user put in correct and in db
 */

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};


/**
 * @module authenticateBearer()
 * @param {object}1
 * @desc checks to see if the current token is valid, unique, non-expired token
 */

users.statics.authenticateBearer = function(token){

  if(usedTokens.has(token)){
    return Promise.reject('Invalid token');
  }

  let parsedToken = jwt.verify(token, process.env.SECRET);

  parsedToken.type !== 'key' && usedTokens.add(token);

  let query = {_id: parsedToken.id};
  return this.findOne(query);
};

/**
 * @module comparePassword()
 * @param {object} password
 * @desc Uses the bcrypt module and compares it to the password that was provided to ensure they match
 */

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

/**
 * @module generateKey()
 * @param {object} type
 * @desc generates a token based on that users specified capabilities
 */

users.methods.generateToken = function(type) {
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || this.role || 'user',
  };
  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) { 
    options = { expiresIn: TOKEN_EXPIRE };
  }
  return jwt.sign(token, SECRET, options);
};


/**
 * @module annoymous()
 * @param {object} capability
 * @desc checks to see if the capabilities passed through is allowed
 */
users.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};

/**
 * @module generateKey()
 * @desc generates a key (a token that doesn't expire)
 */

users.methods.generateKey = function() {
  return this.generateToken('key');
};

module.exports = mongoose.model('users', users);