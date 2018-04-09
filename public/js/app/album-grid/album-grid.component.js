'use strict';

angular.module('albumGrid').
component('albumGrid', {
  templateUrl: '/templates/album-grid.html',
  controller: function(Data, $scope, $stateParams) {


    Data.queryAlbums($stateParams.name)
    .then((response) => {
      $scope.list = response.data;
    }).catch(() => {
      console.log("Cannot find albums for this artist");
    });
    
    $scope.limit = 20;

    $scope.onSearchChange = function() {
      $scope.limit = 20;
    }

    $scope.infiniteScroll = function() {
      $scope.limit += 10;
    }
  }
});
