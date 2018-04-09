'use strict';

angular.module('register').
component('register', {
  templateUrl: '/templates/register.html',
  controller: function(Data, $scope, $window, $compile) {

    let alert = function(type, message) {
      if ($("#alert-placeholder alert").length >= 3) {
        $("#alert-placeholder alert").last().remove();
      }
      angular.element($("#alert-placeholder")).prepend($compile("<alert type='"+type+"' message='"+message+"'></alert>")($scope));
    }

  	$scope.user = {};
    $scope.register = (user) => {
      Data.register(user.email, user.password, user.name).then((response) => {
      	alert("success", user.name + " está registrado no sistema!");
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
