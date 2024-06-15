require('dotenv').config();
var express = require('express');
var logger = require('morgan');
var passport = require('./config/passport'); // Certifique-se de que o caminho está correto
var createError = require('http-errors');
const session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy
var cors = require('cors');
var usersRouter = require('./routes/users');

var app = express();

var mongoose = require("mongoose");
var mongoDB = "mongodb://127.0.0.1/GestaoUcs";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));
db.once("open", () => {
  console.log("Conexão ao MongoDB realizada com sucesso");
  });


var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const corsOptions = {
  origin: 'http://localhost:4201',  // URL da interface
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
};
app.use(cors(corsOptions));

app.use(session({
  secret: 'sua_chave_secreta', // Substitua por uma chave secreta segura
  resave: false,
  saveUninitialized: false
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
