const UC = require('../models/uc');

module.exports.list = async () => {
  return await UC.find().exec();
}

module.exports.findById = (id) => {
  return UC.findOne({ sigla: id }).exec();
}

module.exports.insert = (uc) => {
  uc._id = uc.sigla;  // Definindo o _id com base na sigla
  return UC.create(uc);
}

module.exports.removeById = (id) => {
  return UC.deleteOne({ sigla: id }).exec();
}

module.exports.update = (id, ucData) => {
  return UC.updateOne({ sigla: id }, ucData, { new: true }).exec();
}
