'use strict';

angular.module('albumDetails').
directive('albumDetails', ["LastFM", "Data", "Player", "$http", "$window", function(LastFM, Data, Player, $http, $window) {
  return {
    scope: {
      album: "=album",
      maxSize: "=maxSize"
    },
    templateUrl: '/templates/album-details.html',
    link: function(scope, element, attr, ctrl) {

      scope.Player = Player;

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

      scope.getTimeout = (music) => {
        let arr = music.length.split(":");
        let minSum = parseInt(arr[0]);
        let secSum = parseInt(arr[1]);
        return ((minSum * 60) + secSum)*1000;
      }


      scope.listen = (music) => {
        Data.setLastMusic(music);

        let headers = angular.copy($http.defaults.headers.common['Authorization']);

        delete $http.defaults.headers.common['Authorization'];

        $http.get('https://www.googleapis.com/youtube/v3/search/?part=snippet&q='+music.name+' '+music.artist+'&key=AIzaSyAZ87gwtf9Jhg5vFj_D1e8Fl1y_vSC9uV8').then((response) => {
          scope.videoID = response.data.items[0].id.videoId;
          Player.setVideoID(scope.videoID);
          Player.setMusic(music);

          $window.document.title = music.name + " - " + music.artist + " | Musicoteca";
          $window.setTimeout(() => {
            $window.document.title = "Musicoteca";
            if (Player.hasNext()) {
              scope.listen(Player.getNext());
            }
          }, scope.getTimeout(music))
        });

        $http.defaults.headers.common['Authorization'] = headers;

      }
    }
  }
}])
