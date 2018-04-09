'use strict';

angular.module('musicList').
  component('musicList', {
    templateUrl: '/templates/music-list.html',
    controller: function(Data, $scope, $stateParams) {
     $scope.album = {"name": $stateParams.albumName, "artist": $stateParams.name};
      // Data.getAlbum($stateParams.albumName, $stateParams.name).then((response) => {
      // 	$scope.album = response.data;
      // }).catch(() => {
      // 	console.log("ocorreu um erro ao obter o album em musicList");
      // });
    }
  });
