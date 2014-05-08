// define('app',['angular-route','angular-sanitize'],function(){

// 创建模块
var app = angular.module('app', ['ngRoute','ngSanitize']);

// 自定义filter
app.filter('douban',function(){
  return function(str){
    if(str === undefined) return str;
    return str.replace(/<原文开始>/g,'「').replace(/<\/原文结束>/g,'」')
    .replace(/<[^>].*?>/g,"").replace(/\n/g,'<br/>');
  };
});

// 配置路由
app.config(function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'SearchController',
    templateUrl: 'templates/search.html' 
  }).
  when('/search/:q', {
    controller: 'ListController',
    templateUrl: 'templates/list.html' 
  }).
  when('/detail/:id', {
    controller: 'DetailController',
    templateUrl: 'templates/detail.html' 
  }).
  when('/borrow/:isbn', {
    controller: 'BorrowController',
    templateUrl: 'templates/borrow.html' 
  }).
  when('/detail/:id/annotations', {
    controller: 'AnnotationsController',
    templateUrl: 'templates/annotations.html' 
  }).
  when('/detail/:id/reviews', {
    controller: 'ReviewsController',
    templateUrl: 'templates/reviews.html' 
  }).
  when('/annotation/:id', {
    controller: 'AnnotationController',
    templateUrl: 'templates/annotation.html' 
  }).
  when('/review/:id', { 
    controller: 'ReviewController',
    templateUrl: 'templates/review.html' 
  }).
  otherwise({ redirectTo: '/'}); 
});

// 创建controller
app.controller('SearchController',function ($scope,$location) {
  $scope.search = function(){
    var url = "/search/" + $scope.q;
    $location.path(url);
  }
}).controller('ListController',function ($scope,$routeParams,$http) {
  var q = $routeParams.q;

  $http.get("https://api.douban.com/v2/book/search",
  {
    params: {'q': q}
  }).success(function(res){
    $scope.books = res.books;
  });
}).controller('DetailController',function ($scope,$routeParams,$http,$sanitize) {
  var id = $routeParams.id;

  $http.get("https://api.douban.com/v2/book/"+id).success(function(res){
    $scope.book = res;
  });
}).controller('BorrowController',function ($scope,$routeParams) {
  var isbn = $routeParams.isbn;
  // require(['fetch-nju-lib'],function(fnl){
    var content = fetchBookByIsbn(isbn);
    //todo (Do not manipulate DOM in your controllers)
    $('#borrowInfo').append(content);
  // });
}).controller('AnnotationsController',function ($scope,$routeParams,$http) {
  var id = $routeParams.id;

  $http.get("https://api.douban.com/v2/book/"+id+"/annotations").success(function(res){
    $scope.annotations = res.annotations;
  });
}).controller('AnnotationController',function ($scope,$routeParams,$http,$sanitize) {
  var id = $routeParams.id; 

  $http.get("https://api.douban.com/v2/book/annotation/"+id).success(function(res){ 
    $scope.annotation = res;
  });
}).controller('ReviewsController',function ($scope,$routeParams,$http) {

}).controller('ReviewController',function ($scope,$routeParams,$http) {

});

// return app;

// });


