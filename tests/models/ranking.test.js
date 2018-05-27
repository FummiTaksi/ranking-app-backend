const mongoose = require('mongoose')
const config = require('../../utils/config')
const Ranking = require('../../models/ranking')

beforeAll(async () => {
  console.log('Position BEFOREALL ',config.MONGOLAB_URL)
  await mongoose.connect(config.MONGOLAB_URL)
  mongoose.Promise = global.Promise
})

describe('Ranking ', () => {

  beforeEach( async () => {
    await Ranking.remove({})
  })

  test(' can be created with valid credentials', async () => {
    const rankingModel = {
      competitionName: 'Test Competition',
      date: Date.now()
    }
    const ranking = new Ranking(rankingModel)
    await ranking.save()
    const allRankings = await Ranking.find({})
    expect(allRankings.length).toBe(1)
  })
})

afterAll( async () => {
  await Ranking.remove({})
  await mongoose.connection.close()
  console.log('Ranking afterAll')
})