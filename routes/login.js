var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());
var router = express.Router();

router.post('/', function(req, res, next) {

  /* SCRAP
  passport.authenticate('local', {
    // TODO do something upon authentication, but what?
    //      maybe initialize session?
  });
  */

});

module.exports = router;
