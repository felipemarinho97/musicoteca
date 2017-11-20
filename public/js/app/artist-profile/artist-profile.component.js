'use strict';

angular.module('artistProfile').
  component('artistProfile', {
    templateUrl: '/templates/artist-profile.html',
    controller: function(Data, $stateParams, $scope) {
      $scope.name = $stateParams.name;
      $scope.artist = Data.getArtist($stateParams.name);

      $scope.favorite = function() {
        if ($scope.artist.favorite == 0 || !$scope.artist.favorite) {
          $scope.artist.favorite = 1;
        } else if ($scope.artist.favorite == 1) {
          $scope.artist.favorite = 0;
        } else {
          $scope.artist.favorite = 1;
        }
      }
    }
  });
