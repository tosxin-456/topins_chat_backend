/*
  * a more presentable and ordered version 
*/

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const cors = require('cors');
const bodyParser = require('body-parser');
const Db = require('../config/db');
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

//const port = process.env.PORT || 3000;

// Database setup
Db();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set('view engine', 'ejs');

// Routes
const userRoute = require('./Routes/userRoute');
app.use('/user', userRoute);

// Passport serialization and deserialization
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Passport Google OAuth 2.0 configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URI
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

// Authentication routes
app.get('/', function(req, res) {
  res.render('pages/auth');
});

app.get('/success', (req, res) => res.send(req.user));
app.get('/error', (req, res) => res.send("Error logging in"));

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
  });

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
