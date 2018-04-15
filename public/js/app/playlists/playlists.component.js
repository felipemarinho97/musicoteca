'use strict';

angular.module('playlists').
  component('playlists', {
    templateUrl: '/templates/playlists.html',
    controller: function(Data, Player, $scope, $window, $http) {

      $scope.Player = Player;

      Data.queryPlaylists().then((response) => {
        $scope.playlists = response.data;
      });

      $scope.removeMusic = function(playlistId, musicId) {
        Data.removeMusic(playlistId, musicId).then(() => {
          for (var i = $scope.playlists.length - 1; i >= 0; --i) {
              if ($scope.playlists[i].id == playlistId) {
                  for (var j = $scope.playlists[i].musicList.length - 1; j >= 0; --j) {
                    if ($scope.playlists[i].musicList[j].id == musicId) {
                      $scope.playlists[i].musicList.splice(j,1);
                      break;
                    }
                  }
                  break;
              }
          }
        });


      }

      $scope.removePlaylist = function(playlistId) {
        $('.modal-backdrop').remove();
        Data.removePlaylist(playlistId).then(() => {
          for (var i = $scope.playlists.length - 1; i >= 0; --i) {
              if ($scope.playlists[i].id == playlistId) {
                  $scope.playlists.splice(i,1);
                  break;
              }
          }

        });

      }

      $scope.vazia = (playlist) => {
        return playlist.musicList.length == 0;
      }

      $scope.listenP = (playlist) => {
        for (var i = playlist.musicList.length; i >= 0; i--) {
          Player.addQueue(playlist.musicList[i]);
        }
        if (Player.hasNext()) {
          Player.listen(Player.getNext());
        }
      }



    }
  });
