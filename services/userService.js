const User = require('../models/user')
const bcrypt = require('bcrypt')

const usernameIsValid = (username) => {
  return username && username.length >= 3
}

const passwordIsValid = (password) => {
  return password && password.length >= 5
}

const adminCanBeCreated = async(user) => {
  const username = user.username
  const password = user.password
  const usersWithSameUsername = await User.find({ username: username })
  const usernameIsFree = usersWithSameUsername.length === 0
  return usernameIsFree && usernameIsValid(username) && passwordIsValid(password)
}

const createAdmin = async(user) => {
  const permissionToCreate = await adminCanBeCreated(user)
  if (permissionToCreate) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const userModel = new User({
      username: user.username,
      admin: true,
      passwordHash
    })
    await userModel.save()
  }
}


exports.createAdmin = createAdmin