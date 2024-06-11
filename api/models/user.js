const mongoose = require('mongoose');

const docenteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    username: { type: String, required: true },
    foto: String,
    categoria: String,
    filiacao: String,
    email: { type: String, required: true },
    webpage: String
});

const docentesModel = mongoose.model('Docente', docenteSchema);

module.exports = docentesModel;
