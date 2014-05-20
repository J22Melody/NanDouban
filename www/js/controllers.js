angular.module('app.controllers', [])

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

  $scope.loadMore();
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
    }else{
      $scope.notFound = "没有在图书馆里找到这本书";
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

});