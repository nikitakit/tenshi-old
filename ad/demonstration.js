(function () {

  var app = angular.module("demonstration", [])

  app.controller('demoController', ['$scope', '$http', function ($scope, $http) {
    var demo = this;
    this.number = 0;

    this.answer = function () {
      return demo.number * demo.number;
    };

    this.robots = [
      {
        name: "AllenBot",
        description: "Awesome Description"
      }, 
      {
        name: "DougBot",
        description: "Super Description"
      },
    ]

  }]);

  app.directive('robot', function () {
    return {
      restrict: 'E', 
      templateUrl: 'robot.html',
    };
  }

  );

})();
