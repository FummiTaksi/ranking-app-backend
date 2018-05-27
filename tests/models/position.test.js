const mongoose = require('mongoose')
const config = require('../../utils/config')
const Position = require('../../models/position')

beforeAll(async () => {
  console.log('Position BEFOREALL ',config.MONGOLAB_URL)
  await mongoose.connect(config.MONGOLAB_URL)
  mongoose.Promise = global.Promise
})

describe('User', async() => {

  beforeEach( async () => {
    await Position.remove({})
  })

  test(' can be created with valid credentials', async () => {
    const positionModel = {
      position: 1,
      rating: 1500,
      playerName: 'Testi Testinen'
    }
    const position = new Position(positionModel)
    await position.save()
    const allPositions = await Position.find({})
    expect(allPositions.length).toBe(1)
  })
})

afterAll( async () => {
  await Position.remove({})
  await mongoose.connection.close()
  console.log('Position afterAll')
})