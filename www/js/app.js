// create module
angular.module('app', ['ionic'])

// custom filters
.filter('douban',function(){
  return function(str){
    if(str === undefined) return str;
    return str.replace(/<原文开始>/g,'「').replace(/<\/原文结束>/g,'」')
    .replace(/<[^>].*?>/g,"").replace(/\n/g,'<br/>');
  };
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // url routes
  $urlRouterProvider.otherwise('/'); 

  $stateProvider.
  state('search', {
    url: "/",
    controller: 'SearchController',
    templateUrl: 'templates/search.html' 
  }).
  state('list', {
    url: '/search/:q',
    controller: 'ListController',
    templateUrl: 'templates/list.html' 
  }).
  state('detail', {
    url: '/detail/:id',
    controller: 'DetailController',
    templateUrl: 'templates/detail.html' 
  }).
  state('borrow', {
    url: '/borrow/:isbn',
    controller: 'BorrowController',
    templateUrl: 'templates/borrow.html' 
  }).
  state('annotations', {
    url: '/detail/:id/annotations',
    controller: 'AnnotationsController',
    templateUrl: 'templates/annotations.html' 
  }).
  state('reviews', {
    url: '/detail/:id/reviews',
    controller: 'ReviewsController',
    templateUrl: 'templates/reviews.html' 
  }).
  state('annotation', {
    url: '/annotation/:id',
    controller: 'AnnotationController',
    templateUrl: 'templates/annotation.html' 
  }).
  state('review', { 
    url: '/review/:id',
    controller: 'ReviewController',
    templateUrl: 'templates/review.html' 
  });

  //todo 提取$ionicLoading等有关网络的提示与处理到此处
  $httpProvider.interceptors.push(function($q,$rootScope) {
    var activeRequests = 0;
    var started = function() {
      if(activeRequests==0) {
        $rootScope.$broadcast('loadingStatusActive');
      }    
      activeRequests++;
    };
    var ended = function() {
      activeRequests--;
      if(activeRequests==0) {
        $rootScope.$broadcast('loadingStatusInactive');
      }
    };
    return {
      'request': function(config) {
        started();
        config.timeout = 20000;
        return config || $q.when(config);
      },
      'response': function(response) {
        ended();
        return response || $q.when(response);
      }
    };
  });

})

// controllers

.controller('MainController',function ($scope,$state,$ionicSideMenuDelegate,$window) {
  $scope.$state = $state;

  $scope.getMenu = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.historyBack = function(){
    $window.history.back();
  }
})
.controller('SearchController',function ($scope) {
  $scope.search = function(){
    $scope.$parent.$state.go('list',{q: $scope.q});
  };
})
.controller('ListController',function ($scope,$stateParams,$http,$ionicLoading,$ionicPopup) {
  $ionicLoading.show({
    template: '努力加载中 ...'
  });

  var q = $stateParams.q;

  $http.get("https://api.douban.com/v2/book/search",
  {
    params: {'q': q}
  }).success(function(res){
    $scope.books = res.books;
    $ionicLoading.hide(); 
  }).error(function(res){
    $ionicPopup.alert({
      title: '出错啦',
      template: '网络出问题了 >< <br/>' + res
    }); 
    $ionicLoading.hide(); 
  });
})
.controller('DetailController',function ($scope,$stateParams,$http,$sanitize,$ionicLoading,$ionicPopup) {
  $ionicLoading.show({
    template: '努力加载中 ...'
  });

  var id = $stateParams.id;

  $http.get("https://api.douban.com/v2/book/"+id).success(function(res){
    $scope.book = res;
    $ionicLoading.hide(); 
  }).error(function(res){
    $ionicPopup.alert({
      title: '出错啦',
      template: '网络出问题了 >< <br/>' + res
    }); 
    $ionicLoading.hide(); 
  });
})
.controller('BorrowController',function ($scope,$stateParams,$http,$ionicLoading,$ionicPopup) {
  $ionicLoading.show({
    template: '努力加载中 ...'
  });

  var isbn = $stateParams.isbn;

  $http.get("http://vps.jiangzifan.com:3000/fetchBorrowDataByIsbn",{params:{'isbn': isbn}}).success(function(res){
    $scope.borrowData = res;
    $ionicLoading.hide(); 
  }).error(function(res){
    $ionicPopup.alert({
      title: '出错啦',
      template: '网络出问题了 >< <br/>' + res
    }); 
    $ionicLoading.hide(); 
  });
})
.controller('AnnotationsController',function ($scope,$stateParams,$http) {
  var id = $stateParams.id;

  $http.get("https://api.douban.com/v2/book/"+id+"/annotations").success(function(res){
    $scope.annotations = res.annotations;
  });
})
.controller('AnnotationController',function ($scope,$stateParams,$http,$sanitize) {
  var id = $stateParams.id; 

  $http.get("https://api.douban.com/v2/book/annotation/"+id).success(function(res){ 
    $scope.annotation = res;
  });
})
.controller('ReviewsController',function ($scope,$stateParams,$http) {

})
.controller('ReviewController',function ($scope,$stateParams,$http) {

})

.directive('loadingStatusMessage', function() {
  return {
    link: function($scope, $element, $ionicLoading) {
      var show = function() {
        $element.css('display', 'block');
      };
      var hide = function() {
        $element.css('display', 'none');
      };
      $scope.$on('loadingStatusActive', show);
      $scope.$on('loadingStatusInactive', hide);
      hide();
    }
  };
});

// custom directives
// .directive('back', ['$window', function($window) {
//   return {
//     restrict: 'A',
//     link: function (scope, elem, attrs) {
//       elem.bind('click', function () {
//         $window.history.back();
//       });
//     }
//   };
// }]);
