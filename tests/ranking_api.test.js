const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

describe('/api/ranking ', async() => {
  describe('/new', async() => {
    test(' returns 500 if token is not correct', async() => {
      const wrongCredentials = {
        file: undefined,
        name: 'Test Rank'
      }
      await api
        .post('/api/ranking/new')
        .send(wrongCredentials)
        .set('Authorization', 'bearer xdlsdjuna')
        .expect(500)
    })
  })
})


afterAll(() => {
  server.close()
  console.log('RANKING END')
})