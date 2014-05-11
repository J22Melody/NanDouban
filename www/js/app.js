// create module
angular.module('app', ['ionic','ngRoute'])

// custom filter
.filter('douban',function(){
  return function(str){
    if(str === undefined) return str;
    return str.replace(/<原文开始>/g,'「').replace(/<\/原文结束>/g,'」')
    .replace(/<[^>].*?>/g,"").replace(/\n/g,'<br/>');
  };
})

// url route
.config(function($stateProvider, $urlRouterProvider) {

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
})

// controllers
.controller('SearchController',function ($scope,$location) {
  $scope.search = function(){
    var url = "/search/" + $scope.q;
    $location.path(url);
  }
}).controller('ListController',function ($scope,$stateParams,$http) {
  var q = $stateParams.q;

  $http.get("https://api.douban.com/v2/book/search",
  {
    params: {'q': q}
  }).success(function(res){
    $scope.books = res.books;
  });
}).controller('DetailController',function ($scope,$stateParams,$http,$sanitize) {
  var id = $stateParams.id;

  $http.get("https://api.douban.com/v2/book/"+id).success(function(res){
    $scope.book = res;
  });
}).controller('BorrowController',function ($scope,$stateParams,$http,$sanitize) {
  var isbn = $stateParams.isbn;
  $http.get("http://vps.jiangzifan.com:3000/fetchBookByIsbn",{params:{'isbn': isbn}}).success(function(res){
    $scope.borrowInfo = res;
  });
}).controller('AnnotationsController',function ($scope,$stateParams,$http) {
  var id = $stateParams.id;

  $http.get("https://api.douban.com/v2/book/"+id+"/annotations").success(function(res){
    $scope.annotations = res.annotations;
  });
}).controller('AnnotationController',function ($scope,$stateParams,$http,$sanitize) {
  var id = $stateParams.id; 

  $http.get("https://api.douban.com/v2/book/annotation/"+id).success(function(res){ 
    $scope.annotation = res;
  });
}).controller('ReviewsController',function ($scope,$stateParams,$http) {

}).controller('ReviewController',function ($scope,$stateParams,$http) {

});
