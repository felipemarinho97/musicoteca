'use strict';

angular.module('userProfile').
  component('userProfile', {
    templateUrl: '/templates/user-profile.html',
    bindings: {
      user: "=",
      artists: "=",
      albums: "=",
      musics: "=",
      playlists: "="
    },
    controller: userProfile
  });

function userProfile(Data, Player, $scope, $window, $compile, $http, $stateParams) {
  // if (!$scope.name) {
  //   $scope.user = Data.getUserCredentials();
  //   $scope.name = $scope.user.username;
  //   console.log($scope.user);
  //
  // } else {
  //   Data.getUser($scope.name).then((response) => {
  //     $scope.user = response.data;
  //     console.log($scope.user);

  //
  //   });
  // }

  let alert = function(type, message) {
    if ($("#alert-placeholder alert").length >= 3) {
      $("#alert-placeholder alert").last().remove();
    }
    angular.element($("#alert-placeholder")).prepend($compile("<alert type='"+type+"' message='"+message+"'></alert>")($scope));
  }

  this.$onInit = () => {
    $scope.name = $stateParams.name;
    $scope.Data = Data;
    $scope.user = this.user;
    $scope.artists = this.artists;
    $scope.albums = this.albums;
    $scope.musics = this.musics;
    $scope.playlists = this.playlists;

    if (!this.user) {
      changeRoute("#!/404");
    }

    Data.getUserReceivedMessages(this.user.id).then((response) => {
      $scope.messages = response.data;
    })

    Data.getFollowing($scope.user.id).then((response) => {
      $scope.followings = response.data;
    });

    Data.getFollowers($scope.user.id).then((response) => {
      $scope.followers = response.data;
    });

  }

  $scope.listen = (music) => {
    Data.setLastMusic(music);

    let headers = angular.copy($http.defaults.headers.common['Authorization']);

    delete $http.defaults.headers.common['Authorization'];

    $http.get('https://www.googleapis.com/youtube/v3/search/?part=snippet&q='+music.name+' '+music.artist+'&key=AIzaSyAZ87gwtf9Jhg5vFj_D1e8Fl1y_vSC9uV8').then((response) => {
      $scope.videoID = response.data.items[0].id.videoId;
      Player.setVideoID($scope.videoID);
      Player.setMusic(music);

      $window.document.title = music.name + " - " + music.artist + " | Musicoteca";
      $window.setTimeout(() => {
        $window.document.title = "Musicoteca";
      }, getTimeout(music))
    });

    $http.defaults.headers.common['Authorization'] = headers;

  }

  $scope.msg = {};

  $scope.sendMessage = () => {
    $scope.msg.date = new Date();
    $scope.msg.likes = 0;
    Data.sendMessage(this.user.id, $scope.msg).then((response) => {
      Data.getUserReceivedMessages(this.user.id).then((response) => {
        $scope.messages = response.data;
      });
      $scope.msg = {};
    });
  }

  function changeRoute(url, forceReload) {
      $scope = angular.element(document).scope();
      if(forceReload || $scope.$$phase) {
          $window.location = url;
      } else {
          $location.path(url);
          $scope.$apply();
      }
  };

  function getTimeout(music) {
    let arr = music.length.split(":");
    let minSum = parseInt(arr[0]);
    let secSum = parseInt(arr[1]);
    return ((minSum * 60) + secSum)*1000;
  }

}
