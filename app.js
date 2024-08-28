var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var usersRouter = require('./routes/users');
var passcategoryRouter = require('./routes/passcategory');
var addnewcategoryRouter = require('./routes/addnewcategory');
var addnewpasswordRouter = require('./routes/addnewpassword');
var viewallpasswordRouter = require('./routes/viewallpassword');
var passworddetailRouter = require('./routes/password-detail');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/passcategory', passcategoryRouter);
app.use('/addnewcategory', addnewcategoryRouter);
app.use('/addnewpassword',  addnewpasswordRouter);
app.use('/viewallpassword',  viewallpasswordRouter);
app.use('/password-detail',  passworddetailRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
