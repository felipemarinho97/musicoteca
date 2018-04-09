'use strict';

angular.module('artistProfile').
  component('artistProfile', {
    templateUrl: '/templates/artist-profile.html',
    controller: function(Data, $stateParams, $scope) {
      $scope.name = $stateParams.name;
      
      Data.getArtist($stateParams.name).then((response) => {
        $scope.artist = response.data;
      }).catch(() => {
        console.log("erro ao obter artista para o artistProfile");
      });

      $scope.favorite = function() {
        if ($scope.artist.favorite == 0 || !$scope.artist.favorite) {
          $scope.artist.favorite = 1;
        } else if ($scope.artist.favorite == 1) {
          $scope.artist.favorite = 0;
        } else {
          $scope.artist.favorite = 1;
        }
        Data.favoriteArtist({"artistId": $scope.artist.id, "favorite": $scope.artist.favorite == 1 ? true : false})
      }

      $scope.updateClassification = () => {
        Data.classificateArtist({"artistId": $scope.artist.id, "classification": $scope.artist.classification});
      }    
  }
  });
