'use strict';

/**
 * API Server Module
 * @module src/app
 */

const cwd = process.cwd();

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const notFound = require( `${cwd}/src/middleware/404.js` );
const authRouter = require('../src/auth/router');
// const authRouter = require( `${cwd}/auth/router.js` );
const v1Router = require( `${cwd}/src/api/v1.js` );
const errorHandler = require( `${cwd}/src/middleware/500.js`);

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('./docs',express.static('docs'));

//Documentation
const options = require('../docs/config/swagger');
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger(options);

// Routes
app.use(authRouter);
app.use(v1Router);

// Catchalls
app.use(notFound);
app.use(errorHandler);


let start = (port = process.env.PORT) => {
  app.listen(port, () => {
    console.log(`Server Up on ${port}`);
  });
};
  
module.exports = {app,start};
