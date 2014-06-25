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
      $http.get("https://api.douban.com/v2/book/search", { params: { q: q, start: start, count: 10 } })
    .then(function(res){
      $scope.books = $scope.books.concat(res.data.books);
    })
    .then(function (res) {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.loadMore();
})
.controller('DetailController',function ($scope,$stateParams,$http,$sanitize,Collect) {
  var id = $stateParams.id;

  $http.get("https://api.douban.com/v2/book/"+id).success(function(res){
    $scope.$parent.setTitle(res.title); 
    $scope.book = res;

    $scope.collect = Collect;

    $scope.collected = function(){
        return Collect.list.indexOf($scope.book.id) != -1;
    }

    $scope.collect = function(){
        Collect.collect($scope.book.id);
    };

    $scope.uncollect = function(){
        Collect.uncollect($scope.book.id);
    };
  });
})
.controller('BorrowController',function ($scope,$stateParams,$http,borrowData) {
  $scope.$parent.setTitle("馆藏信息"); 
  $scope.borrowData = borrowData;
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
.controller('ReviewsController', function ($scope, $stateParams, $http) {
    var id = $stateParams.id;

    $http.get("http://api.douban.com/v2/book/" + id + "/reviews").success(function (res) {
        $scope.reviews = res.reviews;
    });
})
.controller('ReviewController', function ($scope, $stateParams, $http) {
    var id = $stateParams.id;

    $http.get("http://book.douban.com/review/" + id + "/").success(function (res) {
        var doc = new DOMParser().parseFromString(res, 'text/html');
        var xpathresult = doc.evaluate('//*[@id="link-report"]/span/text()', doc, null, XPathResult.ANY_TYPE, null);
        var thisNode = xpathresult.iterateNext();
        var result = "";
        while (thisNode) {
            console.log(thisNode)
            result = result + "<br/>";
            result = result + thisNode.textContent;
            thisNode = xpathresult.iterateNext();
        }
        $scope.review = { "text": result };
    });
})
.controller('CollectController',function ($scope,$http,Collect) {
    $scope.$parent.setTitle("我的收藏");
    $scope.books = [];
    for(var i in Collect.list){
        var id = Collect.list[i];
        $http.get("https://api.douban.com/v2/book/"+id).success(function(res){
            $scope.books.push(res);
        });
    }
});