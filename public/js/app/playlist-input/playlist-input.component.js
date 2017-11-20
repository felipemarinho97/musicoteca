'use strict';

angular.module('playlistInput').
  component('playlistInput', {
    templateUrl: '/templates/playlist-input.html',
    controller: function(Data, $scope, $compile) {

      let alert = function(type, message) {
        if ($("#alert-placeholder alert").length >= 3) {
          $("#alert-placeholder alert").last().remove();
        }

        angular.element($("#alert-placeholder")).prepend($compile("<alert type='"+type+"' message='"+message+"'></alert>")($scope));
      }

      let check = function(atribute) {
        if (atribute === '') {
          alert("danger", "Por favor, preencha os campos indicados.");
          return true;
        }
        return false;
      }

      $scope.playlist = {
        name: "",
        musics: {}
      }

      $scope.createNewPlaylist = function() {
        if (check($scope.playlist.name)) {

        } else if (angular.isDefined(Data.getPlaylist($scope.playlist.name))) {
          alert("warning", 'Playlist "' + $scope.playlist.name + '" já existe');
        } else {
          Data.putPlaylist(angular.copy($scope.playlist));

          alert("success", 'Playlist "' + $scope.playlist.name + '" adiconada!');
        }
      }
    }
  });
