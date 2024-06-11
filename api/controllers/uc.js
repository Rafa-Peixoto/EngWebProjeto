const UC = require('../models/uc'); 

module.exports.list = async () => {
  return await UC
    .find()
    .exec();
}

module.exports.findById = id => {
  return UC
    .findById(id)  
    .exec();
}

module.exports.findByTitulo = titulo => {
  return UC
    .find({ titulo: titulo })
    .exec();
}

module.exports.insert = uc => {
  return UC.create(uc);
}

module.exports.removeById = id => {
  return UC.deleteOne({ _id: id });  
}

module.exports.update = (id, ucData) => {
  return UC.updateOne({ _id: id }, ucData, { new: true });  // Adiciona `new: true` para retornar o documento modificado
}