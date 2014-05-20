angular.module('app.directives', [])

// custom directives

.directive('loadingStatusMessage', function() {
  return {
    link: function($scope, $element, $ionicLoading) {
      var activeRequests = 0;

      var started = function() {
        if(activeRequests==0) {
          show('努力加载中 ...');
        }    
        activeRequests++;
      };

      var ended = function() {
        activeRequests--;
        if(activeRequests==0) {
          hide();
        }
      };

      var error = function() {
        activeRequests--;
        $element.html('网络异常 QAQ');  
        setTimeout(function(){
            hide();
        },2000);
      };

      window.alertMsg = function(word){
        show(word);
        setTimeout(function(){
            hide();
        },2000);
      }

      var show = function(word) {
        $element.html(word).css('opacity', '1');
      };

      var hide = function() {
        $element.css('opacity', '0'); 
      };

      $scope.$on('loadingStatusActive', started);
      $scope.$on('loadingStatusInactive', ended);
      $scope.$on('loadingStatusError', error);
    }
  };
});