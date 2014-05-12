var request = require('request');
var $ = require('node-jquery');

// var fetchBorrowTableByIsbn = function(isbn,callback){
//     var search_page_url = 'http://calis2.nju.edu.cn:8080/opac/openlink.php?s2_type=isbn&isbn=' + isbn;

//     request(search_page_url,function (error, response, body){
//         var search_result_page = body;
//         try{
//             var book_page_url = search_result_page.match(/item\.php\?marc_no=\d+/)[0];
//         }catch(err){
//             callback('馆内没有此图书');
//         }
//         book_page_url = 'http://calis2.nju.edu.cn:8080/opac/' + book_page_url;

//         request(book_page_url,function (error, response, body){
//             var content = $('#tab_item table',body.replace(/<img.*>/g,''));
//             var el = $('<div></div>');
//             el.append(content);
//             callback(el[0].innerHTML);
//         });
//     });
// }

var fetchBorrowDataByIsbn = function(isbn,callback){
    var search_page_url = 'http://calis2.nju.edu.cn:8080/opac/openlink.php?s2_type=isbn&isbn=' + isbn;

    request(search_page_url,function (error, response, body){
        var search_result_page = body;
        try{
            var book_page_url = search_result_page.match(/item\.php\?marc_no=\d+/)[0];
        }catch(err){
            callback(false);
        }
        book_page_url = 'http://calis2.nju.edu.cn:8080/opac/' + book_page_url;

        request(book_page_url,function (error, response, body){
            var list = $('#tab_item table .whitetext',body);
            var data = [
            ]
            list.each(function(){
                var item = {};
                var tds = $(this).find('td');
                item.callNum = tds.eq(0).text();
                item.stripNum = tds.eq(1).text();
                item.location = tds.eq(3).text();
                item.status = tds.eq(4).text();
                data.push(item); 
            });
            callback(data);
        });
    });
}

exports.fetchBorrowDataByIsbn = fetchBorrowDataByIsbn;