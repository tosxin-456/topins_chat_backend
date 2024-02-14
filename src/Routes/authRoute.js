// authRoutes.js
const express = require('express');
const passport = require('../../config/passportConfig');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('pages/auth');
});

router.get('/success', (req, res) => res.send(req.user));
router.get('/error', (req, res) => res.send("Error logging in"));

router.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email', 'openid', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.gender.read'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
  });

module.exports = router;
