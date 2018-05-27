const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

describe('/api/ranking ', () => {
  describe('/new', () => {
    test(' returns 400 if token is not correct', async() => {
      const wrongCredentials = {
        file: undefined,
        name: 'Test Rank'
      }
      await api
        .post('/api/ranking/new')
        .send(wrongCredentials)
        .set('Authorization', 'bearer xdlsdjuna')
        .expect(400)
    },10000)
  })
})


afterAll(() => {
  server.close()
  console.log('RANKING END')
})