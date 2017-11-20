'use strict';

angular.module('musicoteca').
    config(
        function(
          $stateProvider,
          $urlRouterProvider,
          LastFMProvider
          ){
          LastFMProvider.setAPIKey('0d547efb363220e4b21702679dfe1607');
          $stateProvider.
              state("home", {
                  url: "/",
                  component: "artistGrid"
              }).
              state("addArtist", {
                  url: "/add/artists",
                  component: "artistInput"
              }).
              state("addMusic", {
                  url: "/add/music",
                  component: "musicInput"
              }).
              state("profile", {
                  url: "/artist/:name",
                  component: "artistProfile",
                  resolve: {
                    artista: ($stateParams) => {
                      // recupera o artista $stateParams.name
                    }
                  }
              }).
              state("profile.albums", {
                url: "/albums",
                component: "albumGrid"
              }).
              state("addPlaylist", {
                url: "/add/playlist",
                component: "playlistInput"
              }).
              state("profile.musicList", {
                url: "/:albumName",
                component: "musicList"
              }).
              state("search", {
                  url: "/search",
                  component: "artistGrid"
              }).
              state("artist", {
                  url: "/artist",
                  component: "artistGrid"
              }).
              state("music", {
                  url: "/music",
                  component: "musicGrid"
              }).
              state("playlist", {
                  url: "/playlist",
                  component: "playlists"
              }).
              state("404", {
                  url: "/404",
                  template: "Not Found"
              });

          $urlRouterProvider.otherwise("/");

});
