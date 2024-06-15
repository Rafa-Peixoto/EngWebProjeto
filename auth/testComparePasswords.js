const bcrypt = require('bcryptjs');

const plainPassword = '111';
const storedHash = '$2a$10$DaHAtwJTgkebYGU7KIa3EO8626nG93bmEle9FnJOqnO4gKgD6oysS'; // Hash armazenado

// Comparar a senha fornecida com a senha armazenada
bcrypt.compare(plainPassword, storedHash, (err, isMatch) => {
  if (err) {
    console.error('Erro ao comparar senhas:', err);
  } else {
    console.log('Senhas correspondem:', isMatch); // Deve ser true se a senha estiver correta
  }
});