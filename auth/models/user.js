const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  filiacao: String,
  profilefoto: String,
  ucs: [String],
  level: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
  dateCreated: { type: Date, default: Date.now },
  dateLastAccess: { type: Date, default: Date.now }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
