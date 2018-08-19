const bcrypt = require('bcrypt');
const User = require('../models/user');

const usernameIsValid = username => username && username.length >= 3;

const passwordIsValid = password => password && password.length >= 5;

const adminCanBeCreated = async (user) => {
  const { username, password } = user;
  const usersWithSameUsername = await User.find({ username });
  const usernameIsFree = usersWithSameUsername.length === 0;
  return usernameIsFree && usernameIsValid(username) && passwordIsValid(password);
};

const createAdmin = async (user) => {
  const permissionToCreate = await adminCanBeCreated(user);
  if (permissionToCreate) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const userModel = new User({
      username: user.username,
      admin: true,
      passwordHash,
    });
    await userModel.save();
  }
};


exports.createAdmin = createAdmin;
