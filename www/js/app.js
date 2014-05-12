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

  // 监视http请求
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
        // config.headers['Authorization'] = 'Melody ' + '84d2e82b01379e1d8e78b88103a6da57';  
        return config || $q.when(config);
      },
      'response': function(response) {
        ended();
        return response || $q.when(response);
      },
     'responseError': function(rejection) {
        // alert('网络开小差了 ><');
        ended();
        return $q.reject(rejection);
      }
    };
  });

})

// controllers

.controller('MainController',function ($scope,$state,$ionicSideMenuDelegate,$window) {
  $scope.$state = $state;
  $scope.title = "南豆瓣";

  $scope.setTitle = function(val){
    $scope.title = val; 
  }

  $scope.getMenu = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.historyBack = function(){
    $window.history.back();
  }
})
.controller('SearchController',function ($scope) {
  $scope.$parent.setTitle('南豆瓣'); 

  $scope.search = function(){
    $scope.$parent.$state.go('list',{q: $scope.q});
  };
})
.controller('ListController',function ($scope,$stateParams,$http) {
  var q = $stateParams.q;
  $scope.$parent.setTitle('搜索"' + q + '"的结果'); 

  $scope.books = [];

  $scope.loadMore = function() {
    var start = $scope.books.length;
    $http.get("https://api.douban.com/v2/book/search",{params: {q: q,start: start,count: 10}})
    .then(function(res){
      $scope.books = $scope.books.concat(res.data.books);
    },function(res){}
    ).then(function(res){
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.$on('stateChangeSuccess', function() {
    $scope.loadMore();
  });

  // $http.get("https://api.douban.com/v2/book/search",
  // {
  //   params: {'q': q}
  // }).success(function(res){
  //   $scope.books = res.books;
  // });
})
.controller('DetailController',function ($scope,$stateParams,$http,$sanitize) {
  var id = $stateParams.id;

  $http.get("https://api.douban.com/v2/book/"+id).success(function(res){
    $scope.$parent.setTitle(res.title); 
    $scope.book = res;
  });
})
.controller('BorrowController',function ($scope,$stateParams,$http) {
  $scope.$parent.setTitle("馆藏信息"); 
  var isbn = $stateParams.isbn;

  $http.get("http://vps.jiangzifan.com:3000/fetchBorrowDataByIsbn",{params:{'isbn': isbn}}).success(function(res){
    if(res != 'false'){
      $scope.borrowData = res;
    }
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

// custom directives

.directive('loadingStatusMessage', function() {
  return {
    link: function($scope, $element, $ionicLoading) {
      var show = function() {
        var backdrop = document.querySelector('.backdrop');
        if(backdrop) backdrop.className += " active visible";
        $element.css('opacity', '1');
      };
      var hide = function() {
        var backdrop = document.querySelector('.backdrop');
        if(backdrop) backdrop.className = "backdrop";
        $element.css('opacity', '0'); 
      };
      $scope.$on('loadingStatusActive', show);
      $scope.$on('loadingStatusInactive', hide);
    }
  };
});

