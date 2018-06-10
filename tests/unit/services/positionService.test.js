const mongoose = require('mongoose')
const config = require('../../../utils/config')
const Position = require('../../../models/position')
const Ranking = require('../../../models/ranking')
const rankingService = require('../../../services/rankingService')
const positionService = require('../../../services/positionService')

beforeAll(async () => {
  console.log('rankingService before all')
  await mongoose.connect(config.MONGOLAB_URL)
})

describe('rankingService ', () => {

  describe(' createPosition ', () => {
    test(' creates position which has ranking attached to it', async() => {
      const rankingBody = {
        rankingDate: Date.now(),
        rankingName: 'Test Rank'
      }
      const rankingSaveResponse = await rankingService.createRanking(rankingBody)
      const positionBody = {
        playerName: 'Testi Testaaja',
        clubName: 'TOP CLUB',
        rating: 1421,
        position: 120,
        ranking: rankingSaveResponse._id
      }
      await positionService.createPosition(positionBody)
      const allPositions = await Position.find({})
      expect(allPositions.length).toBe(1)
      const savedPosition = allPositions[0]
      expect(savedPosition.playerName).toEqual('Testi Testaaja')
      expect(savedPosition.ranking).toEqual(rankingSaveResponse._id)
    })
  })
})

afterAll( async () => {
  await Position.remove({})
  await Ranking.remove({})
  await mongoose.connection.close()
  console.log('rankingService afterAll')
})