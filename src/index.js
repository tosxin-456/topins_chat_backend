/*
  * a more presentable and ordered version 
*/
const express = require('express');
const Db = require('../config/db');
const middlewareConfig = require('../config/middlewareConfig');
const userRoute = require('./Routes/userRoute');
const gemini = require('./Controllers/geminiController')

// gemini()
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



// Routes
app.use('/user', userRoute);

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//check for task 
// Call checkForTasks initially
// checkForTasks.checkForTasks()

// Update the tasks every 12 hours