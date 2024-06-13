const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    username: String,
    password: String,
    foto: String,
    categoria: String,
    filiacao: String,
    email: String,
    webpage: String,
    level: Number,  
});

module.exports = mongoose.model('user', userSchema);