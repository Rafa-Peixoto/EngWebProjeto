const mongoose = require('mongoose');

const aulaSchema = new mongoose.Schema({
    tipo: String,
    data: String,
    sumario: [String],},
    { _id: false });

const ucSchema = new mongoose.Schema({
  _id: String,
  titulo: String,
  docentes:[String],
  horario:{teorica:[String],pratica:[String]},
  avaliacao:[String],
  datas:{teste:String, exame:String, projeto: String},
  aulas:[aulaSchema],
}, { versionKey: false });

module.exports = mongoose.model('uc', ucSchema);