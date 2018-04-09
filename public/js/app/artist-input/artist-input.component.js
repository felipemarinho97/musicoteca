'use strict';

angular.module('artistInput').
  component('artistInput', {
    templateUrl: '/templates/artist-input.html',
    styleUrls: ['/css/artist-input.component.css'],
    controller: function(Data, $scope, $compile) {

      $scope.artist = {
        name: "",
        imagemSrc: "",
        favorite: false
      }

      $scope.hide = function(element) {
        $(element).hide();
      }

      let alert = function(type, message) {
        if ($("#alert-placeholder alert").length >= 3) {
          $("#alert-placeholder alert").last().remove();
        }
        angular.element($("#alert-placeholder")).prepend($compile("<alert type='"+type+"' message='"+message+"'></alert>")($scope));
      }

      $scope.createNewArtist = function() {
        if ($scope.artist.name === '') {
          alert("danger", 'Nome do artista obrigatório!');  
        } else {
          Data.putArtist(angular.copy($scope.artist)).then(() => {
            alert("success",$scope.artist.name + " adicionado com sucesso!");          
          }).catch((response) => {
            if (response.status == 409) {
              alert("warning", response.data.name+' já existe!');
            } else {
              alert("danger", 'Ocorreu um erro inesperado ao adicionar o artista.');
            }
          });


          $scope.artist.name = "";
          $scope.artist.imagemSrc = "/images/blank_artist.png";

        }
      }
    }
  });
