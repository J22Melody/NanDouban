angular.module('app.services', [])

.factory('FetchBorrowDataByIsbn',function($q,$http){ 
    return function(isbn){
        var delay = $q.defer();

        $http.get("http://vps.jiangzifan.com:3000/fetchBorrowDataByIsbn",{params:{'isbn': isbn}})
        .success(function(res){
            if(res!='false'){
              alertMsg('在图书馆里查找到' + res.length + '本'); 
              delay.resolve(res);
            }else{
              alertMsg('图书馆里没有这本书');  
              delay.reject([]);
            }
        })
        .error(function(){
            delay.reject([]);
        });

        return delay.promise;
    };
});