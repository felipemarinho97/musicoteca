'use strict';

angular.module('navBar').
  component('navBar', {
    templateUrl: '/templates/nav-bar.html',
    controller: function($scope) {
      var items =  [{
        title: "Artistas",
        id: 'artist'
      },
      {
        title: "Músicas",
        id: 'music'
      },
      {
        title: "Playlists",
        id: 'playlist'
      },
      {
        title: "Pesquisar",
        id: 'search'
      }];

      $scope.items = items;

    }
  });
