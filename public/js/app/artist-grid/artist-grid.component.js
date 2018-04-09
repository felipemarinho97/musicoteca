'use strict';

angular.module('artistGrid').
component('artistGrid', {
  templateUrl: '/templates/artist-grid.html',
  bindings: {
    artists: "="
  },
  controller: function(Data, $scope) {

    this.$onInit = () => {
      $scope.list = this.artists;
    }


    $scope.limit = 20;

    $scope.onSearchChange = function() {
      $scope.limit = 20;
    }

    $scope.infiniteScroll = function() {
      $scope.limit += 10;
    }
  }
});
