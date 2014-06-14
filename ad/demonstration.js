(function () {

  var app = angular.module("demonstration", [])

  app.controller('demoController', ['$scope', '$http', function ($scope, $http) {
    demo = this;
    this.number = 0;

    this.answer = function () {
      return demo.number * demo.number;
    };

  }]);
})();
$("#front").text("jQuery works!");
