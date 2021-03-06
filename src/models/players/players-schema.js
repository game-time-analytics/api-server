'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const players = mongoose.Schema({
  name: { type:String, required:true },
  description: { type:String, required:true },
  passing: { type:Number, required:true},
  touchdowns: { type:Number, required:true},
  interceptions: { type:Number, required:true},
  team: {type:String, required:true},
  image: { type:String, required:true },
});

module.exports = mongoose.model('players', players);