'use strict';

angular.module('alert').
  directive('alert', [function(data) {
    return {
      scope: {
        type: "@type",
        message: "@message"
      },
      templateUrl: '/templates/alert.html'
    }
  }])
