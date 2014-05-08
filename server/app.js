var express = require('express');
var app = express();

app.get('/fetchBookByIsbn', function(req, res){
    var fnl = require('./fetch-nju-lib');
    fnl.fetchBookByIsbn(req.query.isbn,function(data){
        res.send(data);
    });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});