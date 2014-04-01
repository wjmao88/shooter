/* global require, exports */
var MemoryStore = require('express').session.MemoryStore;
var connect = require('connect');
var sessionStore = new MemoryStore();

exports.store = sessionStore;
exports.sessionSecret = 'isif()U*(YT4EW"OJTGSOPDKGPEJ';
exports.sid = 'connect.sid';
exports.cookieSecret = 'idY*[.G[P{<{E>F}}]]7VNHN9CM';

exports.unWrap = function(data, session){
  return new connect.middleware.session.Session(data, session);
};

exports.createCookie = function(cookie){
  var result = connect.utils.parseSignedCookies(
    require('cookie').parse(decodeURIComponent(cookie)),
    exports.sessionSecret
  );
  console.log(result);
  return result;
};
