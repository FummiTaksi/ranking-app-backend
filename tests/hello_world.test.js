const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)


test('main route returns 200', async () => {
  await api
    .get('/')
    .expect(200)
})

afterAll(() => {
  server.close()
})