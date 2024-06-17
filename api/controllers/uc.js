const mongoose = require('mongoose');
const UC = require('../models/uc');

module.exports.list = async () => {
  return await UC.find().exec();
}

module.exports.findById = (id) => {
  return UC.findOne({ sigla: id }).exec();
}

module.exports.addFile = async (id, filename) => {
  return UC.findByIdAndUpdate(
    id,
    { $push: { conteudo: filename } },
    { new: true }
  ).exec();
};


module.exports.insert = async (uc) => {
  try {
    const existingUC = await UC.findOne({ sigla: uc.sigla }).exec();
    if (existingUC) {
      throw new Error('UC com esta sigla já existe');
    }
    uc._id = new mongoose.Types.ObjectId();  // Gerando um novo ObjectId para o campo _id
    uc.datas = uc.datas || { teste: null, exame: null, projeto: null }; // Inicializar datas
    const createdUC = await UC.create(uc);

    return createdUC;
  } catch (erro) {
    console.error('Erro ao inserir nova UC:', erro.message);
    throw erro;
  }
};

module.exports.removeById = (id) => {
  return UC.deleteOne({ sigla: id }).exec();
}

module.exports.update = (id, ucData) => {
  ucData.datas = ucData.datas || { teste: null, exame: null, projeto: null }; // Inicializar datas
  return UC.updateOne({ sigla: id }, ucData, { new: true }).exec();
}

module.exports.findAulaById = (ucId, aulaId) => {
  return UC.findOne({ sigla: ucId, "aulas._id": aulaId }, { "aulas.$": 1 }).exec();
}



