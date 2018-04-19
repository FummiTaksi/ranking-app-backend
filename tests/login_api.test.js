const supertest = require('supertest')
const { app, server } = require('../index')
const User = require('../models/user')
const api = supertest(app)


beforeAll(async () => {
  await User.remove({})
})

beforeEach(async () => {
  const user = {
    username: 'TestUser',
    password: 'password',
    admin: false
  }
  const userObject = new User(user)
  userObject.save()
})

describe('/api/login', async() => {

  test('with wrong credentials, access is denied', async () => {
    const credentials = {
      username: 'JokuUkko',
      password: 'ASF'
    }
    await api
      .post('/api/login')
      .send(credentials)
      .expect(403)
      .expect('Content-Type', /application\/json/)
  })

  test('with correct credentials, login is successfull', async() => {
    const credentials = {
      username: 'TestUser',
      password: 'password'
    }
    await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
  })
})

afterEach(async () => {
  await User.remove({})
})


afterAll(() => {
  server.close()
})