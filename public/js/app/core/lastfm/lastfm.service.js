'use strict';

var data = angular.module('lastfm2');

data.factory('Lastfm2', function($resource, $window, $http, Data) {
  const api_url = 'http://ws.audioscrobbler.com/2.0/';
  const api_sec = "b1cbb49f84620f92918beb42ed8a144b";
  const api_key = "457515d5b77f33824524cf86ba52e7a9";

  let session_name, session_id;

  Data.loginPromise().then(() => {
    Data.getUserApps().then((response) => {
      if (response.data) {
        let app = response.data.filter(elem => elem.name === 'LastFM')[0];
        if (app) {
          _setSession(app.sessionName, app.session);
        }
      }
    })
  });


  function makeAnonGetCall(url) {
    let headers = angular.copy($http.defaults.headers.common['Authorization']);
    delete $http.defaults.headers.common['Authorization'];
    let promise = $http.get(url);
    $http.defaults.headers.common['Authorization'] = headers;
    return promise;
  }

  function makeAnonPostCall(url) {
    let headers = angular.copy($http.defaults.headers.common['Authorization']);
    delete $http.defaults.headers.common['Authorization'];
    let promise = $http.post(url);
    $http.defaults.headers.common['Authorization'] = headers;
    return promise;
  }

  function generateSig(method, token) {
    return md5(`api_key${api_key}method${method}token${token}${api_sec}`);
  }

  function generateSign(params) {
    let keys = Object.keys(params).sort();
    let o = '';

    for (let key of keys) {
      if (['format', 'callback'].includes(key)) {
        continue;
      }

      o += key + params[key];
    }

    return md5(o + api_sec);
  }

  function _getSession(token) {
    let sig = generateSig("auth.getSession", token);

    let url = api_url + '?' +
      'method=auth.getSession&' +
      'api_key=' + api_key + '&' +
      'token=' + token + '&' +
      'api_sig=' + sig;

    return makeAnonGetCall(url);
  }

  function _setSession(sn, sid) {
    session_id = sid;
    session_name = sn;
  }

  function _scrobble(artist, track, timestamp, album) {
    let params = {
      'method': 'track.scrobble',
      'artist': artist,
      'track': track,
      'timestamp': timestamp,
      'api_key': api_key,
      'sk': session_id
    }

    if (album) {
      params.album = album;
    }

    params.api_sig = generateSign(params);

    return makeAnonPostCall(api_url + '?' + $.param(params));
  };

  function _sendNowPlaying(artist, track, album, duration) {

    let params = {
      'method': 'track.updatenowplaying',
      'track': track,
      'artist': artist,
      'api_key': api_key,
      'sk': session_id
    };

    if (album) {
      params.album = album;
    }

    if (duration) {
      params.duration = duration;
    }

    params.api_sig = generateSign(params);

    return makeAnonPostCall(api_url + '?' + $.param(params));
  };

  return {
    Auth: {
      getSession: _getSession,
      setSession: _setSession
    },

    Track: {
      scrobble: _scrobble,
      sendNowPlaying: _sendNowPlaying
    }
  }
});
