'use strict';

angular.module('albumGrid').
component('albumGrid', {
  templateUrl: '/templates/album-grid.html',
  controller: function(Data, $scope, $stateParams) {

    $scope.list = Data.queryAlbums($stateParams.name);
    $scope.limit = 20;

    $scope.onSearchChange = function() {
      $scope.limit = 20;
    }

    $scope.infiniteScroll = function() {
      $scope.limit += 10;
    }
  }
});
