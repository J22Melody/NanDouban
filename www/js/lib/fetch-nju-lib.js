// define(['jquery'], function($) {
    var fetchBookByIsbn = function(isbn,selector){
        var content;
        var search_page_url = 'http://calis2.nju.edu.cn:8080/opac/openlink.php?s2_type=isbn&isbn=' + isbn;

        $.ajax({
            url: search_page_url,
            async: false
        }).success(function(res){
            var search_result_page = res;
            var book_page_url = search_result_page.match(/item\.php\?marc_no=\d+/)[0];
            book_page_url = 'http://calis2.nju.edu.cn:8080/opac/' + book_page_url;

            $.ajax({
                url: book_page_url,
                async: false
            }).success(function(res){
                content = $('#tab_item table',res.replace(/<img.*>/g,''))[0];
            });
        });
        return content;
    }

//     return {
//         fetchBookByIsbn: fetchBookByIsbn 
//     };
// });