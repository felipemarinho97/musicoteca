'use strict';

angular.module('floatingPlayer').
  component('floatingPlayer', {
    templateUrl: '/templates/floating-player.html',
    controller: function(Player, Data, $scope, $window, $compile) {
      $scope.Player = Player;

      Data.queryPlaylists().then((response) => {
        $scope.playlists = response.data;
      });

      $scope.largura = $('.floating-player').height;

      $scope.addMusic = function(playlist, music) {
        return Data.addMusic(playlist.id, music);
      }
    }
});
