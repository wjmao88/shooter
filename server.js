/* global require, process, __dirname */
var express = require('express');
var session = require('./app/servers/session.js');
var socket = require('./app/servers/socket.js');
var handlers = require('./app/servers/handlers.js');
var Game = require('./app/game/Game.js').Game;
//variables ===============================================
var portNumber = process.env.PORT || 12345;
//server config ===========================================
var server = express();
server.configure(function() {
  server.engine('html', require('ejs').renderFile);
  server.set('views', __dirname + '/public');
  server.set('view engine', 'html');
  server.use(express.bodyParser());
  server.use(express.cookieParser(session.cookieSecret));
  server.use(express.session({
    store: session.store,
    secret: session.sessionSecret,
    key: session.sid
  }));
  server.use(express.static(__dirname + '/public'));
});
//route ===================================================
server.get('/', function(req, res){
  res.render('/index.html');
});
server.post('/login', handlers.loginUser);
server.get('/logout', handlers.logoutUser);
server.post('/signup', handlers.signupUser);
//start ===================================================
var game = new Game();
socket.listen(server.listen(portNumber), game);
console.log([
  'Started at ' + (new Date()),
  'listening to ' + portNumber
].join(' '));

