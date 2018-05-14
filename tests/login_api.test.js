const supertest = require('supertest')
const { app, server } = require('../index')
const seeder = require('../db/seeds')
const api = supertest(app)



beforeAll(async () => {
  await seeder.seedAdminToDataBase()
})

describe('/api/login', async() => {

  test('with wrong credentials, access is denied', async () => {
    const credentials = {
      username: process.env.ADMIN_USERNAME,
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
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    }
    await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
  })
})


afterAll(() => {
  server.close()
})