const mongoose = require('mongoose')
const config = require('../../utils/config')
const Ranking = require('../../models/ranking')
const Position = require('../../models/position')

beforeAll(async () => {
  console.log('Position BEFOREALL ',config.MONGOLAB_URL)
  await mongoose.connect(config.MONGOLAB_URL)
  mongoose.Promise = global.Promise
})

describe('Ranking ', () => {

  beforeEach( async () => {
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

  test(' can be associated with position', async () => {
    const ranking = new Ranking(rankingModel)
    const rankingSaveResponse = await ranking.save()
    console.log('rankingSaveResponse',rankingSaveResponse)
    const positionModel = {
      position: 1,
      rating: 1500,
      playerName: 'Testi Testinen',
      clubName: 'TestClub',
      ranking: rankingSaveResponse._id
    }
    const position = new Position(positionModel)
    const positionSaveResponse = await position.save()
    console.log('positionSaveResponse',positionSaveResponse)
    expect(positionSaveResponse.ranking).toBe(rankingSaveResponse._id)
  })
})

afterAll( async () => {
  await Ranking.remove({})
  await mongoose.connection.close()
  console.log('Ranking afterAll')
})