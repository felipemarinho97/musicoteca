'use strict';

angular.module('albumDetails').
directive('albumDetails', ["LastFM", "Data", "Player", "Lastfm2", "$http", "$window", function(LastFM, Data, Player, Lastfm2, $http, $window) {
  return {
    scope: {
      album: "=album",
      maxSize: "=maxSize"
    },
    templateUrl: '/templates/album-details.html',
    link: function(scope, element, attr, ctrl) {

      scope.listen = Player.listen;
      scope.Player = Player;
      scope.addQueue = Player.addQueue;


      let calcAlbumDuraction = function() {
        var minSum = 0;
        var secSum = 0;
        scope.musics.forEach(function(music) {
          if (angular.isDefined(music.length)) {
            let arr = music.length.split(":");
            minSum += parseInt(arr[0]);
            secSum += parseInt(arr[1]);
          }
        })
        return (minSum + parseInt(secSum / 60)) + "min e " + (secSum % 60) + "seg" ;
      }

      Data.getAlbum(scope.album.name, scope.album.artist).then((response) => {
        scope.album = response.data;
        scope.musics = response.data.musics;
        scope.albumLength = scope.musics.length;
        scope.albumDuraction = calcAlbumDuraction();
      })

      Data.queryPlaylists().then((response) => {
        scope.playlists = response.data;
      });


      scope.addMusic = function(playlist, music) {
        return Data.addMusic(playlist.id, music);
      }

    }
  }
}])
