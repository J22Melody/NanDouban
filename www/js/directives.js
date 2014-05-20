angular.module('app.directives', [])

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
      var error = function() {
        $element.html('网络异常 QAQ'); 
        setTimeout(function(){
          hide();
        },1000);
      }
      $scope.$on('loadingStatusActive', show);
      $scope.$on('loadingStatusInactive', hide);
      $scope.$on('loadingStatusError', error);
    }
  };
});