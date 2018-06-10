const mongoose = require('mongoose')
const config = require('../../../utils/config')
const Ranking = require('../../../models/ranking')
const rankingService = require('../../../services/rankingService')

beforeAll(async () => {
  console.log('rankingService before all')
  await mongoose.connect(config.MONGOLAB_URL)
})

describe('rankingService ', () => {

  describe(' createRanking ', () => {
    test(' creates ranking with correct body', async() => {
      const body = {
        rankingDate: Date.now(),
        rankingName: 'Test Rank'
      }
      await rankingService.createRanking(body)
      const allRankings = await Ranking.find({})
      expect(allRankings.length).toBe(1)
    })
  })
})

afterAll( async () => {
  await Ranking.remove({})
  await mongoose.connection.close()
  console.log('rankingService afterAll')
})