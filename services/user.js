const User = require('../models/user')
const bcrypt = require('bcrypt')

const createAdmin = async(user) => {
  const username = user.username
  if (!username || username.length <= 2) {
    throw new Error ('Username must be longer than 1 digits')
  }
  const usersWithSameUsername = await User.find({ username: username })
  if (usersWithSameUsername.length > 0 ) {
    throw new Error('Username taken!')
  }
  const password = user.password
  if (!password || password.length <= 2) {
    throw new Error('Password must be longer than 1 digit')
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const userModel = new User({
    username: username,
    admin: true,
    passwordHash
  })
  await userModel.save()
}

exports.createAdmin = createAdmin