'use strict';

angular.module('playlists').
  component('playlists', {
    templateUrl: '/templates/playlists.html',
    controller: function(Data, $scope) {

      $scope.playlists = Data.queryPlaylists();

      $scope.removeMusic = function(playlistName, music) {
        return Data.removeMusic(playlistName, music);
      }

      $scope.removePlaylist = function(playlistName) {
        $('.modal-backdrop').remove();
        Data.removePlaylist(playlistName);
        $scope.playlists = Data.queryPlaylists();
      }

      $scope.vazia = (playlist) => {
        return Object.keys(playlist.musics).length == 0;
      }

    }
  });
