const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

describe('/api/ranking', () => {
  describe('/new', () => {
    describe(' returns 400 when ', () => {


      test(' token is not correct', async() => {
        const wrongCredentials = {
          file: undefined,
          rankingName: 'Test Rank',
          rankingDate: new Date()
        }
        await api
          .post('/api/ranking/new')
          .send(wrongCredentials)
          .set('Authorization', 'bearer xdlsdjuna')
          .expect(400)
      },10000)
      test(' body is missing rankingName', async() => {
        const correctCredentials = {
          username: process.env.ADMIN_USERNAME,
          password: process.env.ADMIN_PASSWORD
        }
        const response = await api.post('/api/login').send(correctCredentials)
        const missingRankingName = {
          file: 'asfasa',
          rankingDate: new Date()
        }
        await api
        .post('/api/ranking/new')
        .send(missingRankingName)
        .set('Authorization', 'bearer ' + response.body.token)
        .expect(400)
      },10000)
    })

  })
})


afterAll(() => {
  server.close()
  console.log('RANKING END')
})