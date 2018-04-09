'use strict';

angular.module('userSettings').
component('userSettings', {
  templateUrl: '/templates/user-settings.html',
  controller: function(Data, $scope, $window, $compile) {

    let alert = function(type, message) {
      if ($("#alert-placeholder alert").length >= 3) {
        $("#alert-placeholder alert").last().remove();
      }
      angular.element($("#alert-placeholder")).prepend($compile("<alert type='"+type+"' message='"+message+"'></alert>")($scope));
    }

    Data.login();
    $scope.user = Data.getUserCredentials();    
    console.log($scope.user);
    $scope.update = (user) => {
      Data.update(user).then((response) => {
        Data.login();
      	alert("success", user.nome + " está registrado no sistema!");
      }).catch((response) => {
        if (response.status == 409) {
          alert("warning", "O email já está cadastrado no sistema.")
        } else {
        	alert("danger", "Ocorreu um erro inesperado ao tentar se registrar.");
        }
      });
    }

  }
});
