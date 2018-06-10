const mongoose = require('mongoose')
const config = require('../../../utils/config')
const User = require('../../../models/user')
const bcrypt = require('bcrypt')

beforeAll(async () => {
  console.log('User BEFOREALL ',config.MONGOLAB_URL)
  await mongoose.connect(config.MONGOLAB_URL)
  console.log('CONNECTED in User')
})

describe('User', () => {

  beforeEach( async () => {
    await User.remove({})
  })

  const getCorrectUser = async () => {
    const passwordHash = await bcrypt.hash('password', 10)
    return  {
      username: 'User1',
      passwordHash,
      admin: true
    }
  }
  test(' can be created with valid credentials', async () => {
    const userModel = await getCorrectUser()
    const user = new User(userModel)
    await user.save()
    const allUsers = await User.find({})
    expect(allUsers.length).toBe(1)
  })
})

afterAll( async () => {
  await User.remove({})
  await mongoose.connection.close()
  console.log('User after all')
})