angular.module('ionic-image-upload', ['ionic', 'ngCordova', 'ion-floating-menu', "starter.controllers", "ion-sticky", "ionic-pullup"])

.run(function($rootScope) {
  ionic.Platform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs) {
      el.bind('change', function(event) {
        var files = event.target.files;
        var file = files[0];
        if (file && typeof(file) !== undefined && file.size > 0) {
          scope.file = file;
          scope.$parent.file = file;
        } else {
          scope.file = {};
          scope.$parent.file = {};
        }
        scope.$apply();
      });
    }
  };
})


.controller('imageController', function($scope, $cordovaCamera, $cordovaFile) {
  // 1
  $scope.images = [];


  $scope.addImage = function() {
    // 2
    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
    };

    // 3
    $cordovaCamera.getPicture(options).then(function(imageData) {

      // 4
      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      // 5
      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
            fileEntry.copyTo(
              fileSystem2,
              newName,
              onCopySuccess,
              fail
            );
          },
          fail);
      }

      // 6
      function onCopySuccess(entry) {
        $scope.$apply(function() {
          $scope.images.push(entry.nativeURL);
        });
      }

      function fail(error) {
        console.log("fail: " + error.code);
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
      console.log(err);
    });
  }

  $scope.urlForImage = function(imageName) {
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  }

  $scope.sendEmail = function() {
    // 1
    var bodyText = "<h2>Look at this images!</h2>";
    if (null != $scope.images) {
      var images = [];
      var savedImages = $scope.images;
      for (var i = 0; i < savedImages.length; i++) {
        // 2
        images.push("" + $scope.urlForImage(savedImages[i]));
        // 3
        images[i] = images[i].replace('file://', '');
      }

      // 4
      window.plugin.email.open({
          to: ["saimon@devdactic.com"], // email addresses for TO field
          cc: Array, // email addresses for CC field
          bcc: Array, // email addresses for BCC field
          attachments: images, // file paths or base64 data streams
          subject: "Just some images", // subject of the email
          body: bodyText, // email body (for HTML, set isHtml to true)
          isHtml: true, // indicats if the body is HTML or plain text
        }, function() {
          console.log('email view dismissed');
        },
        this);
    }
  }
})

.controller('UploadController', function($scope, $state, $http, $ionicLoading, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate) {
  $ionicModal.fromTemplateUrl('templates/modal2.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  // Triggered in the login modal to close it
  $scope.closeLogin2 = function() {
    $scope.modal2.hide();
  };

  $scope.login2 = function() {
    $scope.modal2.show();
  };

  // var data = JSON.stringify({
  //   "url": "https://s3.amazonaws.com/com.thinkcrazy.ionicimageupload/Z5cLCGeS-ionic.png",
  //   "type": "i"
  // });
  //
  // var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  //
  // xhr.addEventListener("readystatechange", function() {
  //   if (this.readyState === 4) {
  //     console.log(this.responseText);
  //   }
  // });
  //
  // xhr.open("POST", "http://52.33.175.67:3000/getObjectFromS3");
  // xhr.setRequestHeader("content-type", "application/json");
  // xhr.setRequestHeader("cache-control", "no-cache");
  // xhr.send(data);
  // An alert dialog
  $scope.image = {
    src: "img/def2.png"
  };

  var imageUploader = new ImageUploader();
  $scope.result = {};
  $scope.file = {};
  $scope.upload = function() {
    $ionicLoading.show({
      template: '<p>Uploading...</p><ion-spinner></ion-spinner><p>And the Magic!</p>'
    });
    imageUploader.push($scope.file)
      .then((data) => {
        console.log($scope.file, $scope.file.name);
        console.debug('Upload complete. Data:', data);
        $scope.result.url = data.url;
        console.log($scope.result.url);
        $scope.image.src = data.url;
        $http.defaults.headers.post['Content-Type'] = 'application/json';
        $http({
            method: 'POST',
            url: 'http://52.33.175.67:3000/getObjectFromS3',
            data: {
              type: "i",
              url: $scope.result.url
            },
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .success(function(response) {
            // handle success things
            console.log(response);
            $scope.var = response.name;
            $http({
              method: "GET",
              url: 'http://52.33.175.67:3000/getSimilar/' + $scope.var,
              headers: {
                'Content-Type': 'application/json'
              }
            }).success(function(response) {
              $scope.groups = [];
              $scope.groups1 = [];
              $scope.sim = [];
              $scope.prod = [];
              console.log(response);
              $scope.sim = response[0];
              console.log(response[0]);
              $scope.prod = response[1];
              console.log(response[1]);
              for (var i = 0; i < $scope.sim.length; i++) {
                $scope.groups[i] = {
                  name: $scope.sim[i].title,
                  hyper: $scope.sim[i].reference,
                  items: []
                };
                $scope.groups[i].items.push($scope.sim[i].reference);
                for (var j = 0; j < $scope.sim[i].wikipedia_category.length; j++) {
                  $scope.groups[i].items.push($scope.sim[i].wikipedia_category[j]);
                }
              }
              if ($scope.prod != []) {
                for (var i = 0; i < $scope.prod.length; i++) {
                  $scope.groups1[i] = {
                    name: $scope.prod[i].name,
                    price: $scope.prod[i].salePrice,
                    url: $scope.prod[i].url,
                    img: $scope.prod[i].image
                  };
                }
              }
            })

            console.log($scope.var);
            $ionicLoading.hide();
            // $scope.showAlert();
            $scope.modal2.show();

          })
          .error(function(data, status, headers, config) {
            // handle error things
          })

        $scope.$digest();
      })
      .catch((err) => {
        console.error(err);
        $ionicLoading.hide();
        $scope.result.error = err;
      });
  };
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.setting', {
      url: '/setting',
      views: {
        'menuContent': {
          templateUrl: 'templates/setting.html',
          controller: 'settingCtrl'
        }
      }
    })
    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashboardCtrl'
        }
      }
    })
    .state('app.single', {
      url: '/playlists/:playlistId',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
