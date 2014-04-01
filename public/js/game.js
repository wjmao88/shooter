angular.module('game', [
    'gameData'
  ])
  .controller('GameControl', [
    '$scope',
    'mapData',
    function($scope, mapData){
      $scope.data = mapData.data;

      var keyMap = {
        '38': 'forward',
        '40': 'stop',
        '37': 'left',
        '39': 'right',
        '32': 'shoot'
      };

      angular.element(document.body).on('keydown', function(event){
        var action = keyMap[event.keyCode];
        if (action) {
          mapData.playerAction(keyMap[event.keyCode]);
        }
      });
    }
  ])
//
;
