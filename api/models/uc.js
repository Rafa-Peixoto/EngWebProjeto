const mongoose = require('mongoose');

const aulaSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Adicionando campo _id
  tipo: String,
  data: Date,
  sumario: [String],
}, { _id: false });

const ucSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId },
  sigla: String,
  titulo: String,
  owner: String,
  docentes: [String],
  horario: {
    teoricas: [String],
    praticas: [String],
  },
  avaliacao: [String],
  datas: {
    teste: Date,
    exame: Date,
    projeto: Date,
  },
  aulas: [aulaSchema],
  conteudo: [String],
}, { versionKey: false });

module.exports = mongoose.model('uc', ucSchema);
