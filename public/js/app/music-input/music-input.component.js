'use strict';

angular.module('musicInput').
component('musicInput', {
  templateUrl: '/templates/music-input.html',
  styleUrls: ['/css/music-input.component.css'],
  controller: function(Data, $scope, $rootScope, $compile, LastFM) {

    function clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    }

    let alert = function(type, message) {
      if ($("#alert-placeholder alert").length >= 3) {
        $("#alert-placeholder alert").last().remove();
      }
      angular.element($("#alert-placeholder")).prepend($compile("<alert type='" + type + "' message='" + message + "'></alert>")($scope));
    }

    let check = function(atribute) {
      if (atribute === '') {
        alert("danger", "Por favor, preencha os campos indicados.");
        return true;
      }
      return false;
    }

    $scope.music = {
      name: "",
      artist: "",
      album: "",
      anoDeLancamento: null,
      duracao: ""
    }

    var album = {
      musicas: {},
      addMusic: function(music) {
        this.musicas[name] = music;
      }
    }

    $scope.createNewMusic = function() {
      if (check($scope.music.name) || check($scope.music.artist) ||
        check($scope.music.album) || check($scope.music.anoDeLancamento) ||
        check($scope.music.duracao)) {

      } else if (Data.getMusic($scope.music)) {
        alert("warning", "Música já existe");
      } else {

        // let a = LastFM.Album.getInfo($scope.music.artist, $scope.music.album);
        //
        // setTimeout(function(){
        //   console.log(a.$$state.value.image[2]["#text"]);
        // }, 500)

        Data.putMusic(angular.copy($scope.music));

        alert("success", $scope.music.name + " - " + $scope.music.artist + " adiconado!");
      }
    }
  }
});
