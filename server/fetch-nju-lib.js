var request = require('request');
var $ = require('node-jquery');

var fetchBookByIsbn = function(isbn,callback){
    var content = 1;
    var search_page_url = 'http://calis2.nju.edu.cn:8080/opac/openlink.php?s2_type=isbn&isbn=' + isbn;

    request(search_page_url,function (error, response, body){
        var search_result_page = body;
        try{
            var book_page_url = search_result_page.match(/item\.php\?marc_no=\d+/)[0];
        }catch(err){
            callback('馆内没有此图书');
        }
        book_page_url = 'http://calis2.nju.edu.cn:8080/opac/' + book_page_url;

        request(book_page_url,function (error, response, body){
            content = $('#tab_item table',body.replace(/<img.*>/g,''));
            el = $('<div></div>');
            el.append(content);
            callback(el[0].innerHTML);
        });
    });
}

exports.fetchBookByIsbn = fetchBookByIsbn;