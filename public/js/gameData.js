angular.module('gameData', [])
  .service('mapData', [
    '$http',
    '$location',
    '$rootScope',
    function($http, $location, $rootScope){
      var data = {
        map: [],
        playerId: -1,
        scale: 300
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

      var distance = function(a, b){
        return Math.pow(
          Math.pow(a.x - b.x, 2) +
          Math.pow(a.y - b.y, 2),
          1/2
        );
      };
      var player;
      on('updateMap', function(serverData){
        data.map.length = 0;
        player = serverData.map[data.playerId];

        var center = data.scale/2;
        var dir = 0 - Math.PI/2;
        serverData.map.forEach(function(object){
          if (!object || object === player){
            return;
          }

          object.x = object.x - player.x;
          object.y = object.y - player.y;

          var d =  Math.pow(object.x*object.x + object.y + object.y, 1/2);

          if (d  < data.scale){
            var direction = Math.PI/2 + (player.direction + object.direction) % (Math.PI * 2);
            object.x = center + d * Math.cos(-direction);
            object.y = center + d * Math.sin(-direction);
            console.log(d, object.x, object.y, object);
            data.map.push(object);
          }
        });
        player.x = center;
        player.y = center;
        player.direction = dir;
      });

      this.playerAction = function(action){
        emit('playerAction', {
          action: action
        });
      };
    }
  ]);
