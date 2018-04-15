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
            me: resolveMe,
            artists: resolveUserArtists,
            albums: resolveUserAlbums,
            musics: resolveUserMusics,
            playlists: resolveUserPlaylists,
            followings: resolveUserFollowings,
            followers: resolveUserFollowers
          },
          component: "userProfile"
        }).
        state("userProfile.settings", {
          url: "/settings",
          component: "userSettings",
          resolve: {
            apps: resolveUserApps
          }
        }).
        state("404", {
          url: "/404",
          template: "<div class='container p-5'><h1>Não encontrado</h1><div>"
        });

      $urlRouterProvider.otherwise("/");

    });

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
  Data.login();
  if (!$stateParams.name) {
    return Data.getUserCredentials();
  } else {
    return Data.getUser($stateParams.name).then((response) => {
      // console.log(response.data);
      return response.data;
    }).catch(() => {
      return false;
    });
  }
}

function resolveMe(Data) {
  return Data.loginPromise().then(() => {
    let me = Data.getUserCredentials();
    return Data.getUser(me.username).then((response) => {
      return response.data;
    });
  });
}

function resolveUserApps(Data) {
  return Data.getUserApps().then((response) => {
    return response.data;
  });
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

function resolveUserFollowings(Data, $stateParams) {
  return Data.getFollowing($stateParams.name).then((response) => {
    return response.data;
  });
}

function resolveUserFollowers(Data, $stateParams) {
  return Data.getFollowers($stateParams.name).then((response) => {
    return response.data;
  });
}
