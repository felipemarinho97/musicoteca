'use strict';

var data = angular.module('player');

data.factory('Player', function($resource, $window, $http, $log, Data, Lastfm2) {
  let videoID = '';
  let music = {};
  let queue = [];

  function _setVideoID(_videoID) {
    videoID = _videoID;
  }

  function _getVideoID() {
    return videoID;
  }

  function _setMusic(_music) {
    music = _music;
  }

  function _getMusic() {
    return music;
  }

  function _addQueue(music) {
    queue.push(music);
  }

  function _hasNext() {
    return queue.length != 0;
  }

  function _getNext() {
    return queue.pop();
  }

  function getTimeout(music) {
    return new Promise((resolve, reject) => {
      let val =  Data.getYouTubeVideoDetails(_getVideoID()).then((response) => {
        let duration = response.data.items[0].contentDetails.duration.replace('PT','');
        let min = '';
        let sec = '';
        let flag = false;
        for (var i = 0, n = duration.length; i < n; ++i) {
          if (!flag && (duration[i] != 'M' && duration[i] != 'S')) {
            min += duration[i];
          } else if (flag && (duration[i] != 'M' && duration[i] != 'S')) {
            sec += duration[i];
          } else {
            flag = true;
          }
        }

        let minSum = parseInt(min);
        let secSum = parseInt(sec);
        return ((minSum * 60) + secSum)*1000;
      });

      val.then(resolve(val.then((r) => r)));

    });
  }

  function isScrobbled() {
    return music.scrobbled;
  }

  function setScrobbled(_scrobbled) {
    music.scrobbled = _scrobbled;
  }

  let _listen = (music) => {
    Data.setLastMusic(music);

    Data.getYouTubeVideoID(music).then((response) => {
      let videoID = response.data.items[0].id.videoId;
      _setVideoID(videoID);
      _setMusic(music);
      Lastfm2.Track.sendNowPlaying(music.artist, music.name, music.album).then((response) => {
        $log.info(`Lastfm2 Service: Now playing ${music.name} - ${music.artist}`);
        setScrobbled(false);
      });

      $window.document.title = music.name + " - " + music.artist + " | Musicoteca";
      let timestamp = (new Date().getTime())/1000;
      getTimeout(music).then((response) => {
        $window.setTimeout(() => {
          if ((_getMusic().id == music.id)) {
            $window.document.title = "Musicoteca";
            if (_hasNext()) {
              let next = _getNext();
              _listen(next);
            } else {
              _setVideoID("");
            }
          }
        }, response);
        $window.setTimeout(() => {
          if ((_getMusic().id == music.id) && !isScrobbled()) {
            Lastfm2.Track.scrobble(music.artist, music.name, timestamp, music.album).then((response) => {
              setScrobbled(true);
              $log.info(`Lastfm2 Service: Scrobble "${music.name} - ${music.artist}" enviado.`);
            });
          }
        }, response*0.7);
      })

    });

  }

  return {
    setVideoID: _setVideoID,
    getVideoID: _getVideoID,
    setMusic: _setMusic,
    getMusic: _getMusic,
    addQueue: _addQueue,
    hasNext: _hasNext,
    getNext: _getNext,
    listen: _listen
  }
});
