const Docente = require('../models/user');

module.exports.list = async () => {
  return await Docente
    .find()
    .exec();
}

module.exports.findById = id => {
  return Docente
    .findById(id)
    .exec();
}

module.exports.findByUsername = username => {
  return Docente
    .findOne({ username: username })
    .exec();
}

module.exports.insert = docente => {
  return Docente.create(docente);
}

module.exports.removeById = id => {
  return Docente.deleteOne({ _id: id });
}

module.exports.update = (id, docenteData) => {
  return Docente.findByIdAndUpdate(id, docenteData, { new: true });
}
