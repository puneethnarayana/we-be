angular.module('starter.controllers', [])

.controller("dashboardCtrl", function($scope) {
  $scope.data = [{
    src: "http://images.scripting.com/archiveScriptingCom/2009/09/05/peace.jpg",
    src2: "",
    text: "Shriank K",
    sub: "24 September, 1999"
  }];
  $scope.dats = [{
    src: "http://pisces.bbystatic.com/image2/BestBuy_US/images/products/6443/6443034_sa.jpg;maxHeight=145;maxWidth=222",
    src2: "www.bestbuy.com/site/apple-macbook-air-latest-model-13-3-display-intel-core-i5-8gb-memory-128gb-flash-storage-silver/6443034.p?id=1219661416264&skuId=6443034",
    text: "Macbook Air",
    sub: "Apple"
  }];

})

.controller("settingCtrl", function($scope) {

})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  $scope.playlists = [{
    title: '2016in3words',
    id: 1
  }, {
    title: 'QandeelBaloch',
    id: 2
  }, {
    title: 'SuitsOnCC',
    id: 3
  }, {
    title: 'AFLCrowsPies',
    id: 4
  }, {
    title: 'Luke Shaw',
    id: 5
  }, {
    title: 'Wigan',
    id: 6
  }, {
    title: "Say Me Well"
  }, {
    title: "Paul Harris"
  }, {
    title: "MUTV"
  }, {
    title: "HBH"
  }, {
    title: "thecian"
  }, {
    title: "the_x_clan_origins"
  }, {
    title: "saturdaysnap"
  }, {
    title: "all_in"
  }, {
    title: "moonstone"
  }, {
    title: "tokyomx"
  }, {
    title: "shownu"
  }, {
    title: "hanbin"
  }, {
    title: "pikachu"
  }];

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal1 = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin1 = function() {
    $scope.modal1.hide();
  };

  // Open the login modal
  $scope.tweet = function() {
    $scope.modal1.show();
  };


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [{
    title: 'Reggae',
    id: 1
  }, {
    title: 'Chill',
    id: 2
  }, {
    title: 'Dubstep',
    id: 3
  }, {
    title: 'Indie',
    id: 4
  }, {
    title: 'Rap',
    id: 5
  }, {
    title: 'Cowbell',
    id: 6
  }];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {});
