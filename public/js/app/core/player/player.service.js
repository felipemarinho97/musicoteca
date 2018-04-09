'use strict';

var data = angular.module('player');

data.factory('Player', function($resource, $window, $http) {
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

  return {
    setVideoID: _setVideoID,
    getVideoID: _getVideoID,
    setMusic: _setMusic,
    getMusic: _getMusic,
    addQueue: _addQueue,
    hasNext: _hasNext,
    getNext: _getNext
  }
});
