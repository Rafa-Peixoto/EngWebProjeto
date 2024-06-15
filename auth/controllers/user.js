const User = require('../models/user');

module.exports = {
  list: async () => {
    return await User.find().exec();
  },

  findById: (id) => {
    return User.findById(id).exec();
  },

  findByUsername: (username) => {
    return User.findOne({ username: username }).exec();
  },

  removeById: (id) => {
    return User.deleteOne({ _id: id }).exec();
  },

  update: async (id, userData) => {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    return User.findByIdAndUpdate(id, userData, { new: true }).exec();
  }
};
