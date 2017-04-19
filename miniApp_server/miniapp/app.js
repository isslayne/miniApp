var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var createCompany = require('./routes/createCompany');
var queryUser = require('./routes/queryUser');
var updateMember = require('./routes/updateMember');



var mongoose = require('mongoose');
// var config = require('./models/config');

var RuleList = require('./models/ruleList');

var app = express();


var db = mongoose.connect('mongodb://localhost:27017/miniapp');

 db.connection.on('error', function(err){
  console.log(err);
});
db.connection.on('open', function(){
  console.log("数据库连接成功");
});

// config.init();

var ruleInfo = {
  name:'test',
  address:'广州',
  latitude:23,
  longitude:113.456,
  addressName:'测试',
  signScope:1000,
  workOnTime:'08:30',
  workOffTime:'17:30',
  workDay:'1,2,3,4,5'
};
// var RuleList = mongoose.model('RuleList');
var ruleList = new RuleList(ruleInfo);
// ruleList.save(function(err){
//   if(err){
//     console.log(err);
//     return
//   }
//   console.log('插入数据成功')
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use('/createCompany',createCompany);
app.use('/queryUser',queryUser);
app.use('/updateMemberInfo',updateMember);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
