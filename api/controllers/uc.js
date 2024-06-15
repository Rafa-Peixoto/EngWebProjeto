const UC = require('../models/uc');

module.exports.list = async () => {
  return await UC.find().exec();
}

module.exports.findById = (id) => {
  return UC.findOne({ sigla: id }).exec();
}

module.exports.insert = async (uc) => {
  const existingUC = await UC.findOne({ sigla: uc.sigla }).exec();
  if (existingUC) {
    throw new Error('UC com esta sigla já existe');
  }
  uc._id = uc.sigla;  // Definindo o _id com base na sigla
  return UC.create(uc);
}

module.exports.removeById = (id) => {
  return UC.deleteOne({ sigla: id }).exec();
}

module.exports.update = (id, ucData) => {
  return UC.updateOne({ sigla: id }, ucData, { new: true }).exec();
}

module.exports.findAulaById = (ucId, aulaId) => {
  return UC.findOne({ sigla: ucId, "aulas._id": aulaId }, { "aulas.$": 1 }).exec();
}
