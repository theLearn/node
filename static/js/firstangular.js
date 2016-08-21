var firstangular = angular.module('firstangular', []);
firstangular.controller('firstController', function($scope){
  $scope.firstName = 'gray';
  $scope.lastName = 'man';
  $scope.heading = 'Message : ';
  $scope.updateMessage = function(){
    $scope.message = 'Hello  ' + $scope.firstName + '  ' + $scope.lastName + '!';
  };
});
