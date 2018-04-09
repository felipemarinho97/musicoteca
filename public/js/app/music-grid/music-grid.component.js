'use strict';

angular.module('musicGrid').
  component('musicGrid', {
    templateUrl: '/templates/music-grid.html',
    styleUrls: ['/css/artist-input.css'],
    controller: function(Data, $scope) {

      Data.queryArtists().then((response) => {
        $scope.artists = response.data;
      });

      Data.queryPlaylists().then((response) => {
        $scope.playlists = response.data;
      });

      $scope.addMusic = function(playlistId, music) {
        return Data.addMusic(playlistId, music);
      }
    }
  });
