const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

const passwordCorrect = async (user, password) => {
  if (user === null) {
    return false;
  }
  return bcrypt.compare(password, user.passwordHash);
};

loginRouter.post('/', async (request, response) => {
  try {
    const { body } = request;
    const user = await User.findOne({ username: body.username });
    const correct = await passwordCorrect(user, body.password);
    if (!correct) {
      return response.status(403).send({ error: 'invalid username or password' });
    }
    const userForToken = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(userForToken, process.env.SECRET);
    return response.status(200).send({ token, username: user.username, admin: user.admin });
  } catch (error) {
    return response.status(400).send(error);
  }
});
module.exports = loginRouter;
