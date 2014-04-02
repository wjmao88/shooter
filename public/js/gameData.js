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
        scale: 600,
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
        data.serverScale = serverData.scale;
      });



      on('updateMap', function(serverData){
        data.map.length = 0;
        data.player = serverData.map[data.playerId];

        var px = data.player.x;
        var py = data.player.y;
        var pd = data.player.direction;

        var max = data.serverScale;
        var pxm = max - px;
        var pym = max - py;

        var origin = data.scale/2;

        var rotate = function(x, y){
          var xm = max - x;
          var ym = max - y;

          var dx = Math.min(Math.abs(x - px), xm + px, x + pxm );
          var dy = Math.min(Math.abs(y - py), ym + py, y + pym );

          if (px > x && dx === px - x){
            dx *= -1;
          }
          if (py > y && dy === py - y){
            dy *= -1;
          }
          //var da = (a1 - pd + Math.PI*2) % Math.PI*2;
          //var angle = (Math.atan2(dy, dx) + (Math.PI/2 - pd) + Math.PI*2) % (Math.PI*2);
          x = dx;// * Math.cos(angle) - dy * Math.sin(angle);
          y = dy;// * Math.sin(angle) + dy * Math.cos(angle);
          //console.log(x, y, da);
          return [x, y];
        };


        serverData.map.forEach(function(object, index){
          if (!object){
            return;
          }

          var offset = rotate(object.x, object.y, object.direction);

          if ( offset[0] < origin && offset[0] > -origin &&
               offset[1] < origin && offset[1] > -origin ){
            object.x = origin + offset[0];
            object.y = origin + offset[1];
            //object.direction = offset[2];
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
