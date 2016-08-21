var express = require('express');
var http = require('http');
var https = require('https');
var ejs = require('ejs');
var url = require('url');
var fs = require('fs');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieSession = require('cookie-session');
var basicAuth = require('basic-auth-connect');

var app = express();

var options = {
  host:'127.0.0.1',
  key:fs.readFileSync('ssl/server.pem'),
  cert:fs.readFileSync('ssl/server.crt')
};

app.set('views', './views');
app.engine('html', ejs.renderFile);

var auth = basicAuth(function(username, password){
  return ('grayman' === username && '123456' === password);
});

http.createServer(app).listen(8080);
https.createServer(options, app).listen(3333);

app.use('/', express.static('./static', {maxAge:60*60*1000, redirect:false}));
app.use('/images', express.static('./img'));
