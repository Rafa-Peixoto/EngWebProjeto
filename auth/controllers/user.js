const User = require('../models/user');

// Listar todos os usuários
module.exports.list = async () => {
  return await User.find().exec();
};

// Encontrar usuário por ID
module.exports.findById = id => {
  return User.findById(id).exec();
}

// Encontrar usuário por username
module.exports.findByUsername = username => {
  return User.findOne({ username: username }).exec();
}

// Inserir novo usuário
module.exports.insert = user => {
  return User.create(user);
}

// Remover usuário por ID
module.exports.removeById = id => {
  return User.deleteOne({ _id: id });
}

// Atualizar usuário por ID
module.exports.update = (id, userData) => {
  return User.findByIdAndUpdate(id, userData, { new: true });
}
