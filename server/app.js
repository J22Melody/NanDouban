var express = require('express');
var app = express();

app.get('/fetchBorrowDataByIsbn', function(req, res){
    if(req.query.isbn){
        var fnl = require('./fetch-nju-lib');
        fnl.fetchBorrowDataByIsbn(req.query.isbn,function(data){
            res.send(data); 
        });
    }else{
        res.send(false);
    }
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});