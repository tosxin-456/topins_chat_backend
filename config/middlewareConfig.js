// config/middlewareConfig.js

const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = function (app) {
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
};