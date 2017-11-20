'use strict';

angular.module('musicList').
  component('musicList', {
    templateUrl: '/templates/music-list.html',
    controller: function(Data, $scope, $stateParams) {
      $scope.album = Data.getAlbum($stateParams.albumName, $stateParams.name);
    }
  });
