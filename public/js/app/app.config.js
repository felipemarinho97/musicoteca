'use strict';

angular.module('musicoteca').
  config(
    function(
      $stateProvider,
      $urlRouterProvider,
      LastFMProvider,
      cfpLoadingBarProvider
    ) {
      cfpLoadingBarProvider.parentSelector = '#nav';
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;
      LastFMProvider.setAPIKey('0d547efb363220e4b21702679dfe1607');

      $stateProvider.
        state("home", {
          url: "/",
          component: "artistGrid",
          resolve: {
            artists: resolveArtists
          }
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
          component: "musicList",
          resolve: {
            album: ($stateParams) => {
              return {
                "name": $stateParams.albumName,
                "artist": $stateParams.name
              }
            }
          }
        }).
        state("search", {
          url: "/search",
          component: "artistGrid",
          resolve: {
            artists: resolveArtists
          }
        }).
        state("artist", {
          url: "/artist",
          component: "artistGrid",
          resolve: {
            artists: resolveArtists
          }
        }).
        state("music", {
          url: "/music",
          component: "musicGrid"
        }).
        state("playlist", {
          url: "/playlist",
          component: "playlists"
        }).
        state("login", {
          url: "/login",
          component: "login"
        }).
        state("register", {
          url: "/register",
          component: "register"
        }).
        state("userProfile", {
          url: "/user/:name",
          resolve: {
            user: resolveUser,
            artists: resolveUserArtists,
            albums: resolveUserAlbums,
            musics: resolveUserMusics,
            playlists: resolveUserPlaylists
          },
          component: "userProfile"
        }).
        state("userProfile.settings", {
          url: "/settings",
          component: "userSettings"
        }).
        state("404", {
          url: "/404",
          template: "<div class='container p-5'><h1>Não encontrado</h1><div>"
        });

      $urlRouterProvider.otherwise("/");

    });

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBSBoeSbQRSMJZfqBrW9iQGUL86HgmRrSI",
  authDomain: "musicoteca-186602.firebaseapp.com",
  databaseURL: "https://musicoteca-186602.firebaseio.com",
  projectId: "musicoteca-186602",
  storageBucket: "musicoteca-186602.appspot.com",
  messagingSenderId: "435439679070"
};
firebase.initializeApp(config);

function resolveArtists(Data) {
  Data.login();
  return Data.queryArtists().then((response) => {
    return response.data;
  }).catch(() => {
    console.log("Não foi possível recuperar os artistas.");
    return [];
  })
}

function resolveUser($stateParams, Data) {
  if (!$stateParams.name) {
    return Data.getUserCredentials();
  } else {
    return Data.getUser($stateParams.name).then((response) => {
      return response.data;
    }).catch(() => {
      return false;
    });
  }
}

function resolveUserArtists(Data, $stateParams) {
  return Data.queryUserArtists($stateParams.name).then((response) => {
    return response.data;
  });
}

function resolveUserAlbums(Data, $stateParams) {
  return Data.queryUserAlbums($stateParams.name).then((response) => {
    return response.data;
  });
}

function resolveUserMusics(Data, $stateParams) {
  return Data.queryUserMusics($stateParams.name).then((response) => {
    return response.data;
  });
}

function resolveUserPlaylists(Data, $stateParams) {
  return Data.queryUserPlaylists($stateParams.name).then((response) => {
    return response.data;
  });
}
