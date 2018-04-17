const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)



describe('/api/login', async() => {

  test('with wrong credentials, access is denied', async () => {
    const credentials = {
      username: 'JokuUkko',
      password: 'ASF'
    }
    await api
      .post('/api/login')
      .expect(403)
      .send(credentials)
      .expect('Content-Type', /application\/json/)
  })
})


afterAll(() => {
  server.close()
})