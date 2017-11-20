'use strict';

angular.module('musicGrid').
  component('musicGrid', {
    templateUrl: '/templates/music-grid.html',
    styleUrls: ['/css/artist-input.css'],
    controller: function(Data, $scope) {

      $scope.artists = Data.queryArtists();

      $scope.playlists = Data.queryPlaylists();

      $scope.addMusic = function(playlistName, music) {
        return Data.addMusic(playlistName, music);
      }
    }
  });
