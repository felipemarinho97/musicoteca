'use strict';

angular.module('albumDetails').
directive('albumDetails', ["LastFM", "Data", function(LastFM, Data) {
  return {
    scope: {
      album: "=album",
      maxSize: "=maxSize"
    },
    templateUrl: '/templates/album-details.html',
    link: function(scope, element, attr, ctrl) {

      scope.musics = Data.queryMusics(scope.album.artist, scope.album.name);
      scope.playlists = Data.queryPlaylists();

      scope.addMusic = function(playlistName, music) {
        return Data.addMusic(playlistName, music);
      }

      scope.albumLength = function() {
        return Object.keys(scope.album.musics).length-1;
      }

      scope.albumDuraction = function() {
        var minSum = 0;
        var secSum = 0;
        scope.musics.forEach(function(music) {
          if (angular.isDefined(music.duracao)) {
            let arr = music.duracao.split(":");
            minSum += parseInt(arr[0]);
            secSum += parseInt(arr[1]);
          }
        })
        return (minSum + parseInt(secSum / 60)) + "min e " + (secSum % 60) + "seg" ;
      }

      scope.listen = (music) => {
        Data.setLastMusic(scope.album.artist, music);
      }
    }
  }
}])
