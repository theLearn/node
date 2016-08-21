var express = require('express');
var jade = require('jade');
var ejs = require('ejs');
var https = require('https');
var http = require('http');
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var crypto = require('crypto');

var app = express();

http.createServer(app).listen(8080);

app.use(bodyParser());
app.use(cookieParser('MAGICString'));
app.use(session());

function encodePwd(pwd){
  return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

app.get('/login', function(req, res){

  if(req.session.userInfo)
  {
    res.redirect('/welcome');
  }
  else
  {
    var response = '<form method="POST">' +
                    'username : <input type="text" name="username"><br/>' +
                    'password : <input type="text" name="password"><br/>' +
                    '<input type="submit" value="submit"></form>';

    if(req.session.error)
    {
      response += '<h2>' + req.session.error + '</h2>';
    }

    res.status(200);

    res.set({
      'Content-Type':'text/html',
      'Content-Length':response.length
    });
    res.send(response);
  }
});

app.post('/login', function(req, res){
  var userInfo = {username:req.body.username, password:encodePwd('123456')};
  if(userInfo.password === encodePwd(req.body.password.toString()))
  {
    req.session.regenerate(function(){
      req.session.userInfo = userInfo;
      req.session.success = 'welcome' + userInfo.username;
      res.redirect('/welcome');
    });
  }
  else
  {
    req.session.regenerate(function(){
      req.session.error = "password error";
      res.redirect('/login');
    });
  }
});

app.get('/welcome', function(req, res){
  if(req.session.user)
  {
    res.send('<h2>' + req.session.success + '</h2>' +
            '<p> you have entered the welcome page </p><br/>' +
            '<a href="/logout"> logout </a>');
  }
  else
  {
    req.session.error = 'please login first';
    res.redirect('/login');
  }
});

app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/login');
  });
});
