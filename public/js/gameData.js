angular.module('gameData', [])
  .service('mapData', [
    '$http',
    '$location',
    '$rootScope',
    'accountService',
    function($http, $location, $rootScope, accountService){
      var data = {
        map: [],
        playerId: -1,
        scale: 300,
        player: {}
      };
      this.data = data;

      var socket = io.connect();

      var on = function(eventName, callback){
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      };

      var emit = function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      };

      on('connected', function(serverData){
        data.playerId = serverData.playerId;
      });



      on('updateMap', function(serverData){
        data.map.length = 0;
        data.player = serverData.map[data.playerId];

        var px = data.player.x;
        var py = data.player.y;
        var pd = data.player.direction;

        var rotate = function(x1, y1, a1){
          var dx = x1 - px;
          var dy = y1 - py;
          var da = a1 - pd;
          var angle = Math.atan2(dy, dx) + (Math.PI/2 - pd);
          x = dx * Math.cos(angle) - dy * Math.sin(angle);
          y = dx * Math.sin(angle) + dy * Math.cos(angle);
          return [x, y, da];
        };

        var origin = data.scale/2;

        serverData.map.forEach(function(object, index){
          if (!object){
            return;
          }

          var offset = rotate(object.x, object.y, object.direction);

          if ( true || offset[0] < origin && offset[0] > -origin &&
               offset[1] < origin && offset[1] > -origin ){
            object.x = origin + offset[0];
            object.y = origin + offset[1];
            object.direction = offset[2];
            object.degree = object.direction * 180/Math.PI;
            data.map.push(object);
          }
        });
      });

      this.playerAction = function(action){
        emit('playerAction', {
          action: action
        });
      };
    }
  ]);
