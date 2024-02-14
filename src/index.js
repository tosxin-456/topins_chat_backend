/*
  * a more presentable and ordered version 
*/
const express = require('express');
const Db = require('../config/db');
const googleRegister = require('../src/Controllers/googleRegistration')
const middlewareConfig = require('../config/middlewareConfig');
const User = require('../src/Models/userModel')
const authRoute = require('./Routes/authRoute');
const userRoute = require('./Routes/userRoute');
// Create an Express application
const app = express();
Db();

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.CALLBACK_URI) {
    port = process.env.PORT || 27226; //Sets Default to port 27226 if PORT env variable is not set
  } else {
    port = 33456; 
  }

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
