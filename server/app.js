var express = require('express');
var app = express();

app.get('/fetchBorrowTableByIsbn', function(req, res){
    var fnl = require('./fetch-nju-lib');
    fnl.fetchBorrowTableByIsbn(req.query.isbn,function(data){
        res.send(data);
    });
});

app.get('/fetchBorrowDataByIsbn', function(req, res){
    var fnl = require('./fetch-nju-lib');
    fnl.fetchBorrowDataByIsbn(req.query.isbn,function(data){
        res.send(data);
    });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});