'use strict';

angular.module('artistBox').
directive('artistBox', ["Data", function(Data) {
  return {
    scope: {
      artist: "=artist",
      properties: "=properties"
    },
    templateUrl: '/templates/artist-box.html',
    link: function(scope, element, attr) {
      scope.showItem = 'ng-hide';
      element.find('img').bind('load', function(e) {
        scope.showItem = '';
        scope.$apply();
      });

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
        Data.favoriteArtist({
          "artistId": scope.artist.id,
          "favorite": scope.artist.favorite == 1 ? true : false
        })
      }

      scope.updateClassification = () => {
        Data.classificateArtist({
          "artistId": scope.artist.id,
          "classification": scope.artist.classification
        });
      }

      scope.musicQtd = () => {
        let musicQtd = 0;

        if (!scope.artist.albums) {
          return musicQtd;
        }

        for (var i = scope.artist.albums.length - 1; i >= 0; i--) {
          musicQtd += scope.artist.albums[i].musics.length;
        }

        return musicQtd;
      }

      scope.artist.imagemSrc = check(scope.artist.imagemSrc, "/images/blank_artist.png");
      scope.artist.musicQtd = check(scope.artist.musicQtd, 0);
      scope.artist.albums = check(scope.artist.albums, []);
      // scope.artist.albums.lenght = check(scope.artist.albums.lenght, 0);
      // scope.albumsLenght = Data.queryAlbums();
    }
  }
}])
