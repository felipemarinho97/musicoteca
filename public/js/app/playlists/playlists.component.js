'use strict';

angular.module('playlists').
  component('playlists', {
    templateUrl: '/templates/playlists.html',
    controller: function(Data, Player, $scope, $window, $http) {

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
          $scope.listen(Player.getNext());
        }
      }

      $scope.listen = (music) => {
        Data.setLastMusic(music);

        let headers = angular.copy($http.defaults.headers.common['Authorization']);

        delete $http.defaults.headers.common['Authorization'];

        $http.get('https://www.googleapis.com/youtube/v3/search/?part=snippet&q='+music.name+' '+music.artist+'&key=AIzaSyAZ87gwtf9Jhg5vFj_D1e8Fl1y_vSC9uV8').then((response) => {
          $scope.videoID = response.data.items[0].id.videoId;
          Player.setVideoID($scope.videoID);
          Player.setMusic(music);

          $window.document.title = music.name + " - " + music.artist + " | Musicoteca";
          $window.setTimeout(() => {
            $window.document.title = "Musicoteca";
            if (Player.hasNext()) {
              $scope.listen(Player.getNext());
            }
          }, getTimeout(music))
        });

        $http.defaults.headers.common['Authorization'] = headers;

      }

      function getTimeout(music) {
        let arr = music.length.split(":");
        let minSum = parseInt(arr[0]);
        let secSum = parseInt(arr[1]);
        return ((minSum * 60) + secSum)*1000;
      }

    }
  });
