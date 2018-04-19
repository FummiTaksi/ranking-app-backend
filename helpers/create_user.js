

const createUser = async(user) => {
  const username = user.username
  if (!username || username.length <= 2) {
    return response.status(400).json({error: 'username too short'})
  }
  const usersWithSameUsername = await User.find({username: username})
  if (usersWithSameUsername.length > 0 ) {
    return response.status(400).json({error: 'username must be unique'})
}
    const password = body.password
    if (!password || password.length <= 2) {
        return response.status(400).json({error: 'password too short'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult ? body.adult  : true,
      passwordHash
    })

    const savedUser = await user.save()
}