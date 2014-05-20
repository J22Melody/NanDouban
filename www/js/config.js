angular.module('app.config', [])

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
    templateUrl: 'templates/borrow.html',
    resolve: {
        borrowData: function(FetchBorrowDataByIsbn,$stateParams){
            return FetchBorrowDataByIsbn($stateParams.isbn);
        }
    }
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
  }).
  state('collect', { 
    url: '/collect',
    controller: 'CollectController',
    templateUrl: 'templates/collect.html' 
  });

  // 监视http请求
  $httpProvider.interceptors.push(function($q,$rootScope) {
    return {
      'request': function(config) {
        $rootScope.$broadcast('loadingStatusActive');
        config.timeout = 15000;
        // config.headers['Authorization'] = 'Melody ' + '84d2e82b01379e1d8e78b88103a6da57';  
        return config || $q.when(config);
      },
      'response': function(response) {
        $rootScope.$broadcast('loadingStatusInactive');
        return response || $q.when(response);
      },
     'responseError': function(rejection) {
        $rootScope.$broadcast('loadingStatusError');
        return $q.reject(rejection);
      }
    };
  });

});