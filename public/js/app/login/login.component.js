'use strict';

angular.module('login').
component('login', {
  templateUrl: '/templates/login.html',
  controller: function(Data, $scope, $window, $compile, $location) {

    let alert = function(type, message) {
      if ($("#alert-placeholder alert").length >= 3) {
        $("#alert-placeholder alert").last().remove();
      }
      angular.element($("#alert-placeholder")).prepend($compile("<alert type='"+type+"' message='"+message+"'></alert>")($scope));
    }

  	$scope.user = {};
    $scope.login = (user, remember) => {

      Data.auth(user.email, user.password, remember == true ? true : false).then((response) => {
      	alert("success", response.data.nome + ", você está logado!");
        $scope.changeRoute("#!/user/" + user.email , true)
      }).catch((response) => {
        if (response.status == 401) {
          alert("danger", "Usuário ou senha não coincidem, tente novamente.");
        } else {
          alert("danger", "Não foi possível fazer login.");
        }
      });
    }

    $scope.changeRoute = function(url, forceReload) {
        $scope = angular.element(document).scope();
        if(forceReload || $scope.$$phase) {
            $window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };

  }
});
