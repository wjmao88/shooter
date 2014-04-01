angular.module('app', [
  //=========================
  'account',
  'constants',
  'game',
  'gameData',
  //=========================
  'ngRoute',
  'ngCookies'
])
.config(function($routeProvider, $httpProvider){
  $httpProvider.interceptors.push(['$q', '$cookies', '$location',  function($q, $cookies, $location){
    return {
      'request': function(config) {
        if(config.url === '/logout'){
          console.log('logout');
          delete $cookies['test'];
          $location.path('/accounts');
          return config || $q.when(config);
        } else {
          return config || $q.when(config);
        }
      },

      'responseError': function(rejection) {
        console.log('response rejected', rejection);
        if (rejection.status === 401){
          $location.path('/accounts');
        }
        return $q.reject(rejection);
      }
    };
  }]);
  $routeProvider
    .when('/', {
      templateUrl: 'partials/game.html'
    })
    .when('/accounts', {
      templateUrl: 'partials/account.html'
    })
    //.otherwise({})
    ;
})
//
;

