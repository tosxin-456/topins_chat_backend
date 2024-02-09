require('dotenv').config()
const cors = require('cors');
const express = require('express');
const app = express();
const body_parser = require('body-parser');
const Db = require('../config/db')
const port = process.env.PORT || 3000
// h
const session = require('express-session');
app.use(cors());
// Mongodb db instance
Db()


// h
app.set('view engine', 'ejs');

// h
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

// h
app.get('/', function(req, res) {
  res.render('pages/auth');
});

app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())


app.listen( port, () => {
  console.log(`port running @ ${port}`)
})

//Routes
const userRoute = require('./Routes/userRoute');
app.use('/user',userRoute)


/*  PASSPORT SETUP  */

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URI
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success'); // redirect to dashboard when FE is done.
  });