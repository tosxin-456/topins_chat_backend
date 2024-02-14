/*
  * a more presentable and ordered version 
*/

const express = require('express');
const Db = require('../config/db');
const middlewareConfig = require('../config/middlewareConfig');
const authRoute = require('./Routes/authRoute');
const userRoute = require('./Routes/userRoute');
require('dotenv').config();

const app = express();

let port;

// mongodb default port 27017
// slightly made a tweek so as not to conflic port numbers
// Check if Google authentication is enabled
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.CALLBACK_URI) {
  port = process.env.PORT || 27226; //Sets Default to port 27226 if PORT env variable is not set
} else {
  port = 33456; 
}

// Database setup
Db();

// Middleware
middlewareConfig(app);

// View engine setup
app.set('view engine', 'ejs');
// app.set('views', './views');

// Routes
app.use('/', authRoute);
app.use('/user', userRoute);

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
