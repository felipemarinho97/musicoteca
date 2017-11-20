'use strict';

var data = angular.module('data');

data.factory('Data', function($resource, $http) {
  var playlistList = {};
  var artistList = {};

  /***** REQUESTS INTERNOS PARA FINS DE TESTE
   * Pode ser comentado em caso de necessidade.
   *****/
  $http.get('/json/playlists.json')
    .then((response) => {
      playlistList = response.data;
    }, () => {
      playlistList = {}
    });
  $http.get('/json/artists.json')
    .then((response) => {
      artistList = response.data;
    }, () => {
      artistList = {}
    });
  /***** REQUESTS INTERNOS PARA FINS DE TESTE *****/

  var toArray = function(obj) {
    return $.map(obj, function(value, index) {
      return [value];
    });
  }

  return {
    queryArtists: function() {
      return toArray(artistList);
    },

    queryAlbums: function(artistName) {
      var artist = this.getArtist(artistName);
      return toArray(artist.albums);
    },

    queryMusics: function(artistName, albumName) {
      var album = this.getAlbum(albumName, artistName);
      return toArray(album.musics);
    },

    queryPlaylists: function() {
      return toArray(playlistList);
    },

    queryPlaylistMusics: function(playlistName) {
      return toArray(playlistList[playlistName].musics);
    },

    getArtist: function(name) {
      return artistList[name];
    },

    putArtist: function(data) {
      if (!artistList[data.name]) {
        artistList[data.name] = data;
      }
    },

    getAlbum: function(albumName, artistName) {
      if (artistList[artistName]) {
        return artistList[artistName].albums[albumName];
      }
    },

    setAlbum: function(album) {
      if (!artistList[album.artist]) { // If artist is undefned, create a new.
        this.putArtist({
          name: album.artist,
          imagemSrc: "",
          albums: {
            lenght: 0
          },
          musicQtd: 0
        })
      }

      // Then assign the album to the artist.
      artistList[album.artist].albums[album.name] = album;
      artistList[album.artist].albums.lenght++;
    },

    getMusic: function(music) {
      if (this.getAlbum(music.album, music.artist)) {
        return this.getAlbum(music.album, music.artist).musics[music.name];
      }
    },

    putMusic: function(music) {
      // If album is undefined, create a new album.
      if (!this.getAlbum(music.album, music.artist)) {
        this.setAlbum({
          name: music.album,
          artist: music.artist,
          musics: {
            lenght: 0
          }
        });
      }

      // Then put the music in the album.
      this.getAlbum(music.album, music.artist).musics[music.name] = music;
      this.getAlbum(music.album, music.artist).musics.lenght++;
      artistList[music.artist].musicQtd++;
    },

    getPlaylist: function(name) {
      if (playlistList[name]) {
        return playlistList[name];
      }
    },

    putPlaylist: function(data) {
      if (!playlistList[data.name]) {
        playlistList[data.name] = data;
      }
    },

    removePlaylist: function(playlistName) {
      delete playlistList[playlistName];
    },

    addMusic: function(playlistName, music) {
      let playlist = this.getPlaylist(playlistName);
      playlist.musics[music.name] = music;
    },

    removeMusic: function(playlistName, music) {
      let playlist = this.getPlaylist(playlistName);
      delete playlist.musics[music.name];
    },

    setLastMusic: function(artistName, music) {
      let artist = this.getArtist(artistName);
      artist.last = music;
    }

  }

});
