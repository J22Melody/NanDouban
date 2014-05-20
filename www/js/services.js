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
})

.factory('Collect',function($q,$http){ 
    var collection = localStorage.collection;
    if(collection){
        collection = JSON.parse(collection);
    }else{
        collection = [];
    }
    return {
        collect: function(id){
            if(!collection.indexOf(id) != -1){
                collection.push(id);
            }
            localStorage.collection = JSON.stringify(collection);
        },
        uncollect: function(id){
            collection.splice(collection.indexOf(id),1);
            localStorage.collection = JSON.stringify(collection);
        },
        list: collection
    };
});