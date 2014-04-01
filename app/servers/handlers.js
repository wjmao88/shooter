/* global require, exports */
var User = require('../db/db.js').User;
//=========================================================
var codes = {
  getSuccess: 200,
  postSuccess: 201,
  loginSuccess: 202,
  noLogin: 401,
  notFound: 404,
  serverError: 500
};
//=========================================================
var createSession = function(req, res, newUser) {
  console.log('create session');
  return req.session.regenerate(function() {
    req.session.user = newUser;
    res.send(codes.loginSuccess);
  });
};

//=========================================================
exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.send(codes.getSuccess);
  });
};

exports.loginUser = function(req, res) {
  console.log('login');
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec(function(err,user) {
    if (!user) {
      res.send(codes.noLogin);
    } else {
      var savedPassword = user.password;
      User.comparePassword(password, savedPassword, function(err, match) {
        if (!err && match) {
          createSession(req, res, user);
        } else {
          res.send(codes.noLogin);
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec(function(err, user) {
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, newUser) {
        if (err) {
          res.send(codes.serverError, err);
        }
        createSession(req, res, newUser);
      });
    } else {
      res.send(codes.noLogin);
    }
  });
};
