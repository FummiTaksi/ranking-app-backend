const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)
    if ( !(user && passwordCorrect) ) {
      return response.status(403).send({ error: 'invalid username or password' })
    }
    const userForToken = {
      username: user.username,
      id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    response.status(200).send({ token, username: user.username, admin: user.admin })
  }
  catch(error) {
    response.status(400).send(error)
  }
})

module.exports = loginRouter