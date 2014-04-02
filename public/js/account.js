angular.module('account', [])
  .service('accountService', ['$http', '$location', function($http, $location){
    var that = this;
    this.loggedIn = false;

    this.errorInfo = {
      hasError: false,
      message: ''
    };

    this.login = function(username, password){
      this.action('/login', username, password);
    };

    this.signup = function(username, password){
      this.action('/signup', username, password);
    };

    this.logout = function(){
      return $http({
        method: 'GET',
        url: '/logout'
      })
      .success(function(data, status, headers, config){
        that.loggedIn = false;
        $location.path('/accounts');
      });
    };

    this.action = function(url, username, password){
      return $http({
        method: 'POST',
        url: url,
        data: {
          username: username,
          password: password
        }
      })
      .success(function(data, status, headers, config){
        $location.path('/');
      })
      .error(function(data, status, headers, config){
        $location.path('/accounts');
        that.errorInfo.message = data;
        that.errorInfo.hasError = true;
      });
    };
  }])
  .controller('AccountController', ['$scope', 'accountService', function($scope, accountService){
    $scope.username = '';
    $scope.password = '';
    $scope.confirmPassword = '';
    $scope.errorInfo = accountService.errorInfo;
    $scope.showLogin = true;

    $scope.mismatchPassword = function(){
      return !$scope.showLogin &&
        $scope.password !== $scope.confirmPassword;
    };

    $scope.toggleLogin = function(showLogin){
      $scope.showLogin = showLogin;
    };

    $scope.action = function(){
      if ($scope.showLogin){
        accountService.login($scope.username, $scope.password);
      } else {
        accountService.signup($scope.username, $scope.password);
      }
    };
  }])
  .directive('navigation', function(){
    return {
      require: 'accountService',
      //apply directive to navigation elements and attributes
      restrict: 'AE',
      templateUrl: 'partials/navigation.html',
      //replace navigation elements
      //replace: true,
      scope: {},
      controller: ['$scope', 'accountService', function($scope, accountService){
        $scope.logout = accountService.logout;
      }]
    };
  })
//
;
