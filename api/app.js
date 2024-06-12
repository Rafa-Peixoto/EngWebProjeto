var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
<<<<<<< HEAD
var indexRouter = require('./routes/index');
=======

var indexRouter = require('./routes/uc');
>>>>>>> 406d253caf2f53185321a8080ff688d64fc1e5a6
var usersRouter = require('./routes/users');
var ucsRouter = require('./routes/ucs');
var app = express();
var mongoose = require("mongoose");

var mongoDB = "mongodb://127.0.0.1/GestaoUcs";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));
db.once("open", () => {
  console.log("Conexão ao MongoDB realizada com sucesso");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ucs', ucsRouter);

module.exports = app;
