'use strict';

/**
 * App Module
 * @module src/app
 */

const cwd = process.cwd();

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require( `${cwd}/src/middleware/500.js`);
const notFound = require( `${cwd}/src/middleware/404.js` );
const authRouter = require(`${cwd}/src/auth/router.js`);

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Jsdocs and Swagger
app.use(express.static('docs'));
app.use('/docs', express.static('docs'));

const options = require('../docs/config/swagger');
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger(options);

// Auth Routes
app.use(authRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

/**
 * @type {Object}
 * @param {*} port
 * @desc connects to port specified .env file
 */
let start = (port = process.env.PORT) => {
  app.listen(port, () => {
    console.log(`Server Up on ${port}`);
  });
};

module.exports = {app,start};