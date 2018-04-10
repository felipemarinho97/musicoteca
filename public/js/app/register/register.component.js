'use strict';

angular.module('register').
component('register', {
  templateUrl: '/templates/register.html',
  controller: function(Data, $scope, $window, $compile, cfpLoadingBar) {

    let alert = function(type, message) {
      if ($("#alert-placeholder alert").length >= 3) {
        $("#alert-placeholder alert").last().remove();
      }
      angular.element($("#alert-placeholder")).prepend($compile("<alert type='"+type+"' message='"+message+"'></alert>")($scope));
    }

  	$scope.user = {};
    $scope.register = (user) => {
      if (user.fileList) {
        let file = user.fileList[0];
        let storageRef = firebase.storage().ref('profile_pics/' + user.email + '/' + file.name);
        let task = storageRef.put(file);
        cfpLoadingBar.start();
        task.on('state_changed',
          function progress(snapshot) {
            let percent = (snapshot.bytesTransferred / snapshot.totalBytes);
            cfpLoadingBar.set(percent);
          },

          function error(err) {
            cfpLoadingBar.complete();
          },

          function complete() {
            cfpLoadingBar.complete();
            storageRef.getDownloadURL().then((url) => {
              user.profilePicUrl = url;
              _register(user)
            });
          }
        );
      } else {_register(user);};
    }

    function _register(user) {
      Data.register(user.email, user.password, user.name).then((response) => {
        alert("success", user.name + " está registrado no sistema!");
        Data.auth(user.email, user.password, false).then((response) => {
          Data.login().then(() => {
            console.log("fui invocado");
            user.username = user.email;
            Data.update(user);
          });
        });

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

angular.module('register').directive("filesInput", function() {
  return {
    require: "ngModel",
    link: function postLink(scope,elem,attrs,ngModel) {
      elem.on("change", function(e) {
        var files = elem[0].files;
        ngModel.$setViewValue(files);
      })
    }
  }
});
