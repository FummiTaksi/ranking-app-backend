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
        const response = await api
          .post('/api/ranking/new')
          .send(wrongCredentials)
          .set('Authorization', 'bearer xdlsdjuna')
          .expect(400)
        expect(response.body.error).toEqual('You must be signed in admin to create new ranking!');
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
        const rankingResponse = await api
        .post('/api/ranking/new')
        .send(missingRankingName)
        .set('Authorization', 'bearer ' + response.body.token)
        .expect(400)
        expect(rankingResponse.body.error).toEqual('Ranking must have a name!')
      },10000)
      test(' body is missing rankingDate', async() => {
        const correctCredentials = {
          username: process.env.ADMIN_USERNAME,
          password: process.env.ADMIN_PASSWORD
        }
        const response = await api.post('/api/login').send(correctCredentials)
        const missingRankingDate= {
          file: 'asfasa',
          rankingName: 'Test Cup'
        }
        const rankingResponse = await api
        .post('/api/ranking/new')
        .send(missingRankingDate)
        .set('Authorization', 'bearer ' + response.body.token)
        .expect(400)
        expect(rankingResponse.body.error).toEqual('Ranking must have a date!')
      },10000)
    })

  })
})


afterAll(() => {
  server.close()
  console.log('RANKING END')
})