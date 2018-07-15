const mongoose = require('mongoose')
const config = require('../../../utils/config')
const Ranking = require('../../../models/ranking')
const Position = require('../../../models/position')

beforeAll(async () => {
  console.log('ranking before all')
  await mongoose.connect(config.MONGOLAB_URL)
})

describe('Ranking ', () => {

  beforeEach( async () => {
    console.log('REMOVING  POSITIONS')
    await Position.remove({})
    console.log('REMOVING RANKINGS')
    await Ranking.remove({})
  })

  let rankingModel = {
    competitionName: 'Test Competition',
    date: Date.now()
  }
  test(' can be created with valid credentials', async () => {
    const ranking = new Ranking(rankingModel)
    await ranking.save()
    const allRankings = await Ranking.find({})
    expect(allRankings.length).toBe(1)
  })

  test(' has positions', async () => {
    const positionModel = {
      position: 1,
      rating: 1500,
      playerName: 'Testi Testinen',
      clubName: 'TestClub'
    }
    const position = new Position(positionModel)
    const positionSaveResponse = await position.save()
    rankingModel.positions = [positionSaveResponse]
    const ranking = new Ranking(rankingModel)
    const rankingSaveResponse = await ranking.save()
    expect(rankingSaveResponse.positions.length).toBe(1)
    const rankingWithPopulatedPositions = await Ranking.findById(rankingSaveResponse._id)
      .populate('positions', { position: 1, rating: 1, playerName: 1, clubName: 1 })
    expect(rankingWithPopulatedPositions.positions[0].position).toEqual(1)
    expect(rankingWithPopulatedPositions.positions[0].clubName).toEqual('TestClub')
  })
})

afterAll( async () => {
  await Ranking.remove({})
  await Position.remove({})
  await mongoose.connection.close()
  console.log('Ranking afterAll')
})