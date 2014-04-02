/* global require, exports */
var sessionManager = require('./session.js');

exports.listen = function(server, game){
  var io = require('socket.io').listen(server, {log: false});

  io.set('authorization', function(data, accept){
    console.log('authorization');
    if (data.headers.cookie) {
      console.log('has found');
      data.cookie = sessionManager.createCookie(data.headers.cookie);
      data.sessionID = data.cookie[sessionManager.sid];
      data.sessionStore = sessionManager.store;
      sessionManager.store.get(data.sessionID, function (err, session) {
        if (err || !session) {
          console.log(err? err : 'no err');
          console.log(session? 'session':'no session');
          accept('Error', false);
        } else {
          data.session = sessionManager.unWrap(data, session);
          accept(null, true);
        }
      });
    } else {
      accept('No cookie transmitted.', false);
    }
  });

  //%$^&*^%$#@%^&*()%$^&%$*%^&%^*&^&*
  var playerNameCount = 0;

  //=======================================================
  var frame = function(){
    game.turn();
    io.sockets.emit('updateMap', {
      map: game.map
    });
    setTimeout(frame, 160);
  };
  frame();

  //=======================================================
  io.sockets.on('connection', function (socket) {
    var hs = socket.handshake;

    var intervalID = setInterval(function () {
      hs.session.reload(function () {
        hs.session.touch().save();
      });
    }, 60 * 1000);

    //#@$%^&*(^%$^%#@%^&*)
    var playerName = playerNameCount++;
    //e*&^($%^&^*(%(&^*^&*)))

    var player = game.createPlayer(playerName);

    socket.on('disconnect', function () {
      game.map[player.id] = false;
    });

    socket.emit('connected', {
      playerId: player.id,
      scale: game.scale
    });

    socket.on('playerAction', function(action){
      game.playerAction(player, action);
    });
  });
};
