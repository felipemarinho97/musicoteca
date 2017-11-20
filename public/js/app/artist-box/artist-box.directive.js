'use strict';

angular.module('artistBox').
directive('artistBox', [function(data) {
  return {
    scope: {
      artist: "=artist",
      properties: "=properties"
    },
    templateUrl: '/templates/artist-box.html',
    link: function(scope, element, attr) {
      var check = function(atribute, value, fnc) {
        if (!atribute || atribute === '') {
          return value;
        } else {
          return atribute;
        }
      };

      scope.favorite = function() {
        if (scope.artist.favorite == 0 || !scope.artist.favorite) {
          scope.artist.favorite = 1;
        } else if (scope.artist.favorite == 1) {
          scope.artist.favorite = 0;
        } else {
          scope.artist.favorite = 1;
        }
      }
      scope.artist.imagemSrc = check(scope.artist.imagemSrc, "/images/blank_artist.png");
      scope.artist.musicQtd = check(scope.artist.musicQtd, 0);
      scope.artist.albums = check(scope.artist.albums, {});
      scope.artist.albums.lenght = check(scope.artist.albums.lenght, 0);
      // scope.albumsLenght = Data.queryAlbums();
    }
  }
}])
