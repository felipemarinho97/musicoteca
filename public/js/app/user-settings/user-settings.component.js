'use strict';

angular.module('userSettings').
component('userSettings', {
  templateUrl: '/templates/user-settings.html',
  bindings: {
    user: '=',
    apps: '='
  },
  controller: function(Data, $scope, $window, $compile, $http, $log, Lastfm2) {

    let alert = function(type, message) {
      if ($("#alert-placeholder alert").length >= 3) {
        $("#alert-placeholder alert").last().remove();
      }
      angular.element($("#alert-placeholder")).prepend($compile("<alert type='" + type + "' message='" + message + "'></alert>")($scope));
    }

    Data.login();
    this.$onInit = () => {
      $scope.user = Data.getUserCredentials();


      let token, sig, urlParams, app;

      urlParams = new URLSearchParams($window.location.search);

      if (urlParams.has('token')) {
        token = urlParams.get('token');
        Lastfm2.Auth.getSession(token).then((response) => {
          let $doc = $((new DOMParser()).parseFromString(response.data, "text/xml"));
          app = {'name': 'LastFM'};
          app.sessionName = $doc.find('session > name').text();
          app.session = $doc.find('session > key').text();
          Lastfm2.Auth.setSession(app.sessionName, app.session);
          this.apps.push(app);
          Data.addUserApp(app).then((response) => {
            console.log(`INFO: Last.fm (${response.data.sessionName}) adicionado aos apps`);
          });
        });

      }

      $scope.update = (user) => {
        Data.update(user).then((response) => {
          Data.login();
          alert("success", user.nome + " foi atualizado!");
        }).catch((response) => {
          if (response.status == 409) {
            alert("warning", "O email já está cadastrado no sistema.")
          } else {
            alert("danger", "Ocorreu um erro inesperado ao tentar salvar mudanças.");
          }
        });
      }

      // let lastfm =
      $log.debug(this.apps);

      $scope.lastfm = () => this.apps.some(elem => elem.name === 'LastFM');
      $scope.sessionName = () => this.apps.filter(elem => elem.name === 'LastFM')[0].sessionName;

      $scope.lastFMUnauth = () => {
        let apps = this.apps.filter(elem => elem.name !== 'LastFM');
        Data.deleteUserApp('LastFM').then((response) => {
          console.log(`INFO: ${response.data.name} removido`);
        });

        this.apps = apps;
        // $scope.lastfm = lastfm();

        // $scope.update($scope.user);
      }


    }


    $scope.lastFMAuth = () => {
      $window.location.replace('http://www.last.fm/api/auth/?api_key=457515d5b77f33824524cf86ba52e7a9&cb=http://localhost:5000/#!/user/felipevm97@gmail.com/settings');
    }

  }
});
