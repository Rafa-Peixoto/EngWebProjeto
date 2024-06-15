const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

console.log('Configurando estratégia local do Passport...');

passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

console.log('Passport configurado com sucesso.');

module.exports = passport;
