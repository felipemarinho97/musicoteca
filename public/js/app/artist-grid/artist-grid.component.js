'use strict';

angular.module('artistGrid').
component('artistGrid', {
  templateUrl: '/templates/artist-grid.html',
  controller: function(Data, $scope) {

    $scope.list = Data.queryArtists();
    $scope.limit = 20;

    $scope.onSearchChange = function() {
      $scope.limit = 20;
    }

    $scope.infiniteScroll = function() {
      $scope.limit += 10;
    }
  }
});
