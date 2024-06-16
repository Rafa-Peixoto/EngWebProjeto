require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/filestore', express.static(path.join(__dirname, 'public/filestore')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const corsOptions = {
  origin: 'http://localhost:4201', 
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
};
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/welcome', authRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;