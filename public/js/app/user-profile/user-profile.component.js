'use strict';

angular.module('userProfile').
  component('userProfile', {
    templateUrl: '/templates/user-profile.html',
    bindings: {
      user: "=",
      me: "=",
      artists: "=",
      albums: "=",
      musics: "=",
      playlists: "=",
      followings: "=",
      followers: "="
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

  $scope.Player = Player;

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
    $scope.followings = this.followings;
    $scope.followers = this.followers;

    if (!this.user) {
      changeRoute("#!/404");
    }

    Data.getUserReceivedMessages(this.user.id).then((response) => {
      $scope.messages = response.data;
    })

    $scope.isFollowing = () => this.followers.some(elem => elem.email === this.me.email);

  }

  $scope.follow = (userId) => {
    this.followers.push(this.me);
    Data.follow(userId);
  }

  $scope.unfollow = (userId) => {
    this.followers = this.followers.filter(elem => elem.email !== this.me.email);
    Data.unfollow(userId);
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

}
