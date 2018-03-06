const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: String,
  admin: Boolean,
  passwordHash: String
})

module.exports = User