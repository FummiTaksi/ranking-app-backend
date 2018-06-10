const mongoose = require('mongoose')
const config = require('../../../utils/config')
const Position = require('../../../models/position')
const Ranking = require('../../../models/ranking')

beforeAll(async () => {
  await mongoose.connect(config.MONGOLAB_URL)
  mongoose.Promise = global.Promise
})

describe('Position', () => {

  beforeEach( async () => {
    await Ranking.remove({})
    await Position.remove({})
  })

  test(' can be created with valid credentials', async () => {
    const positionModel = {
      position: 1,
      rating: 1500,
      playerName: 'Testi Testinen',
      clubName: 'TestClub'
    }
    const position = new Position(positionModel)
    await position.save()
    const allPositions = await Position.find({})
    expect(allPositions.length).toBe(1)
  })

  test(' belongs to Ranking', async () => {
    const rankingModel = {
      competitionName: 'Test Competition',
      date: Date.now()
    }
    const ranking = new Ranking(rankingModel)
    const rankingSaveResponse = await ranking.save()
    const positionModel = {
      position: 1,
      rating: 1500,
      playerName: 'Testi Testinen',
      clubName: 'TestClub',
      ranking: rankingSaveResponse._id
    }
    const position = new Position(positionModel)
    const positionSaveResponse = await position.save()
    expect(positionSaveResponse.ranking).toBe(rankingSaveResponse._id)
    const positionWithPopulatedRanking = await Position.findById(positionSaveResponse._id)
                                                       .populate('ranking', { competitionName: 1 })
    expect(positionWithPopulatedRanking.ranking.competitionName).toEqual('Test Competition')
  })
})

afterAll( async () => {
  await Position.remove({})
  await Ranking.remove({})
  await mongoose.connection.close()
  console.log('Position afterAll')
})