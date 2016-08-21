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
var cookieSession = require('cookie-session');
var basicAuth = require('basic-auth-connect');

var app = express();

var auth = basicAuth(function(user, psd){
  return('grayman' === user && '123456' === psd);
});

app.set('views', './views');
app.set('view engine', 'jade');
// app.engine('jade', jade._express);
app.engine('html', ejs.renderFile);

// app.locals({
//   username:'grayman',
//   nickname:'tudou',
//   markname:'banyungong'
// });

app.locals.username = 'grayman';
app.locals.nickname = 'tudou';
app.locals.markname = 'banyungong';
app.locals.city = 'wuhan';

var options = {
  host:'127.0.0.1',
  key:fs.readFileSync('ssl/server.pem'),
  cert:fs.readFileSync('ssl/server.crt')
};


http.createServer(app).listen(8080);
https.createServer(options, app).listen(3333);

app.use('/', express.static('./static', {maxAge:60*60*1000, redirect:false}));
app.use('/img', express.static('./img'));
app.use('/login', bodyParser());//.use('/', cookieParser()).use('/', session());
app.use('/session', cookieParser()).use('/session', cookieSession({secret:'MAGICALEXPRESSKEY'}));

// app.all('*', function(req, res){
//   console.log('success');
// });

app.get('/login', function(req, res){
  var response = '<form method="POST">' +
                  'username : <input type="text" name="username"><br/>' +
                  'password : <input type="text" name="password"><br/>' +
                  '<input type="submit" value="submit"></form>' ;
  res.status(200);

  res.set({
    'Content-Type':'text/html',
    'Content-Length':response.length
  });
  res.send(response);
});

app.post('/login', function(req, res){
  var response = '<form method="POST">' +
                  'username : <input type="text" name="username"><br/>' +
                  'password : <input type="text" name="password"><br/>' +
                  '<input type="submit" value="submit"></form>' +
                  '<h1>Hello   ' + req.body.username + '</h1>';
  res.set({
    'Content-Type':'text/html',
    'Content-Length':response.length
  });
  res.send(response);
});

app.get('/user', function(req, res){
  app.set('json spaces', 4);
  res.json(200, {
    status:0,
    operateAction:['insert', 'delete', 'update', 'find']
  });
});

// app.all('/user/*', function(req, res){
//   console.log('operate success');
// });

app.get('/user/insert', function(req, res){
  res.send('insert success');
});

app.get('/user/delete', function(req, res){
  res.send('delete success');
});

app.get('/user/update', function(req, res){
  res.send('update success');
});

app.get('/user/find', function(req, res){
  res.send('find success');
});

app.get('/user/icon', function(req, res){
  res.sendfile('userIcon.jpg', {
    maxAge:1,
    root:'./img'
  }, function(err){
    if(err)
    {
      console.log('require icon fail');
    }
    else
    {
      console.log('require icon success');
    }
  });
});

app.get('/viewengine', function(req, res){
  app.set('json spaces', 4);
  res.json(200, {
    status:0,
    type:['jade', 'ejs']
  });
});

app.get('/viewengine/jade', function(req, res){
  res.render('jadeExample');
});

app.get('/viewengine/ejs', function(req, res){
  app.render('ejsExample.html', function(err, renderedData){
    res.send(renderedData);
  });
});

app.get('/session/index', function(req, res){
  console.log(req.cookies);
  if(req.session.status)
  {
    res.send('you have enter ' + req.session.enterCount + ' times')
  }
  else
  {
    res.send('welcome first enter');
  }
});

app.get('/session/middle', function(req, res){
  req.session.status = true;
  if(req.session.enterCount)
  {
    req.session.enterCount += 1;
  }
  else
  {
    req.session.enterCount = 1;
  }
  res.redirect('./index');
});

app.get('/auth', auth, function(req, res){
  res.send('auth success');
});
