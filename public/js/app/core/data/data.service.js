'use strict';

var data = angular.module('data');

data.factory('Data', function($resource, $window, $http, base64) {

  var user;
  // const apiUrl = 'https://musicoteca.herokuapp.com/';
  const apiUrl = 'http://localhost:8080/';
  const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/';
  const googleApiKey = 'AIzaSyAZ87gwtf9Jhg5vFj_D1e8Fl1y_vSC9uV8';

  function makeAnonGetCall(url) {
    let headers = angular.copy($http.defaults.headers.common['Authorization']);
    delete $http.defaults.headers.common['Authorization'];
    let promise = $http.get(url);
    $http.defaults.headers.common['Authorization'] = headers;
    return promise;
  }

  return {
    queryArtists: function() {
      return $http.get(apiUrl + 'artists', {});
    },

    queryAlbums: function(artistName) {
      return $http.get(apiUrl + 'albums/' + artistName);
    },

    queryUserArtists: function(username) {
      return $http.get(apiUrl + 'user/artists/' + username);
    },

    queryUserAlbums: function(username) {
      return $http.get(apiUrl + 'user/albums/' + username);
    },

    queryUserMusics: function(username) {
      return $http.get(apiUrl + 'user/musics/' + username);
    },

    queryUserPlaylists: function(username) {
      return $http.get(apiUrl + 'user/playlists/' + username);
    },

    queryUsers: function() {
      return $http.get(apiUrl + 'users');
    },

    queryMusics: function(artistName, albumName) {
      return $http.get(apiUrl + 'musics/' + artistName + '/' + albumName);
    },

    queryPlaylists: function() {
      return $http.get(apiUrl + 'playlists');
    },

    queryPlaylistMusics: function(playlistName) {
      return toArray(playlistList[playlistName].musics);
    },

    getArtist: function(name) {
      return $http.get(apiUrl + 'artist/' + name);
    },

    putArtist: function(data) {
      return $http.post(apiUrl + 'artist', {"name": data.name,
                            "imagemSrc": data.imagemSrc,
                            "classification": data.classification,
                            "favorite": data.favorite == 1 ? true : false
                            });
    },

    favoriteArtist: (updateObject) => {
      return $http.put(apiUrl + 'artist/favorite', updateObject);
    },

    classificateArtist: (updateObject) => {
      return $http.put(apiUrl + 'artist/classification', updateObject);
    },

    setLastMusic: function(music) {
      return $http.put(apiUrl + 'artist/' + music.artist + '/' + music.id);
    },

    classificateAlbum: (albumId, classification) => {
      return $http.put(apiUrl + 'album/' + albumId + '/' + classification);
    },

    getAlbum: function(albumName, artistName) {
      return $http.get(apiUrl + 'album/' + artistName + '/' + albumName);
    },

    putMusic: function(music) {
      return $http.post(apiUrl + 'music', music);
    },

    putPlaylist: function(data) {
      return $http.post(apiUrl + 'playlists/' + data.name);
    },

    removePlaylist: function(playlistId) {
      return $http.delete(apiUrl + 'playlists/' + playlistId);
    },

    addMusic: function(playlistId, music) {
      return $http.put(apiUrl + 'playlists/' + playlistId + '/' + music.id);
    },

    removeMusic: function(playlistId, musicId) {
      return $http.delete(apiUrl + 'playlists/' + playlistId + '/' + musicId);
    },

    auth: (email, pass, remember) => {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + base64.encode(email + ':' + pass);

      $window.sessionStorage.token = base64.encode(email + ':' + pass);

      if (remember) {
        $window.localStorage.token = base64.encode(email + ':' + pass);
      }

      $http.post(apiUrl + 'login', {}, {"method": "POST"}).then((response) => {
        user = response.data;
      }).catch(() => {})

      return $http.post(apiUrl + 'login', {}, {"method": "POST"});
    },

    login: () => {
      if ($window.localStorage.token) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $window.localStorage.token;
      } else {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $window.sessionStorage.token;
      }
      $http.post(apiUrl + 'login', {}, {"method": "POST"}).then((response) => {
        user = response.data;
      })
    },

    loginPromise: () => {
      return new Promise((resolve, reject) => {
        if ($window.localStorage.token) {
          $http.defaults.headers.common['Authorization'] = 'Basic ' + $window.localStorage.token;
        } else {
          $http.defaults.headers.common['Authorization'] = 'Basic ' + $window.sessionStorage.token;
        }
        $http.post(apiUrl + 'login', {}, {"method": "POST"}).then((response) => {
          user = response.data;
        }).then(resolve);
      });
    },

    // getUserCredentials: () => {
    //   return $http.post(apiUrl + 'login', {}, {"method": "POST"});
    // },

    getUserCredentials: () => {
      return user;
    },

    getUser: (username) => {
      return $http.get(apiUrl + 'user/' + username);
    },

    getFollowing: (userID) => {
      return $http.get(apiUrl + 'user/following/' + userID);
    },

    getFollowers: (userID) => {
      return $http.get(apiUrl + 'user/followers/' + userID);
    },

    follow: (userID) => {
      return $http.post(apiUrl + 'user/follow/' + userID);
    },

    unfollow: (userID) => {
      return $http.post(apiUrl + 'user/unfollow/' + userID);
    },

    logout: () => {
      delete $window.localStorage.token;
      delete $window.sessionStorage.token;
      delete $http.defaults.headers.common['Authorization'];
      user = undefined;
    },

    register: (email, pass, name) => {
      delete $http.defaults.headers.common['Authorization'];
      return $http.post(apiUrl + 'register', {"email": email, "pass": pass, "nome": name}, {"method": "POST", "headers": {"Content-Type": "application/json"}});
    },

    update: (user) => {
      return $http.post(apiUrl + 'user/update', {"email": user.username, "nome": user.nome, "profilePicUrl": user.profilePicUrl, "apps": user.apps});
    },

    getYouTubeVideoID: (music) => {
      return makeAnonGetCall(`${youtubeApiUrl}search/?part=snippet&q=${music.name} ${music.artist}&key=${googleApiKey}`);
    },

    getYouTubeVideoDetails: (videoID) => {
      return makeAnonGetCall(`${youtubeApiUrl}videos?id=${videoID}&part=contentDetails&key=${googleApiKey}`);
    },

    sendMessage: (userID, msg) => {
      return $http.post(apiUrl + 'message/' + userID, msg);
    },

    getUserReceivedMessages: (userID) => {
      return $http.get(apiUrl + 'user/message/' + userID);
    },

    getUserSentMessages: (userID) => {
      return $http.get(apiUrl + 'user/message/' + userID + '/sent');
    },

    getUserApps: () => {
      return $http.get(apiUrl + 'user/apps');
    },

    addUserApp: (app) => {
      return $http.post(apiUrl + 'user/apps', app);
    },

    deleteUserApp: (appName) => {
      return $http.delete(apiUrl + `user/apps/${appName}`);
    }
  }

});
