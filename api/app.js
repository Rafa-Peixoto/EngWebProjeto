var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var cors = require('cors');




var mongoDB = "mongodb://127.0.0.1/GestaoUcs";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));
db.once("open", () => {
  console.log("Conexão ao MongoDB realizada com sucesso");
  });

var app = express();

const corsOptions = {
  origin: 'http://localhost:4201',  // URL da interface
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
};
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var ucsRouter = require('./routes/ucs');  
app.use('/ucs', ucsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err.message);
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
