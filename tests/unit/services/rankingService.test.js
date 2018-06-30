const mongoose = require('mongoose')
const config = require('../../../utils/config')
const Ranking = require('../../../models/ranking')
const Position = require('../../../models/position')
const rankingService = require('../../../services/rankingService')
const positionService = require('../../../services/positionService')
const fileService = require('../../../services/fileService')
const testHelpers = require('../../helpers/testHelpers')

beforeAll(async () => {
  console.log('rankingService before all')
  await mongoose.connect(config.MONGOLAB_URL)
})

const saveRankingToDataBase = async () => {
  const body = testHelpers.getRankingBody()
  const base64 = testHelpers.getRatingBase64()
  const fileJson = fileService.convertBase64ToExcel(base64)
  await rankingService.saveRankingToDatabase(fileJson, body)
}

const saveRankingWithOnePosition = async () => {
  const rankingModel = {
    competitionName: 'Test Competition',
    date: Date.now()
  }
  const ranking = new Ranking(rankingModel)
  const savedRanking = await ranking.save()
  const positionModel = {
    position: 1,
    rating: 1500,
    playerName: 'Testi Testinen',
    clubName: 'TestClub',
    ranking: savedRanking._id,
  }
  const position = new Position(positionModel)
  const positionSaveResponse = await position.save()
  rankingModel.positions = [positionSaveResponse._id]
  await Ranking.findByIdAndUpdate(savedRanking._id, rankingModel)
}

describe('rankingService ', () => {

  describe(' createRanking ', () => {
    beforeAll(async () => {
      await Ranking.remove({})
      await Position.remove({})
    })
    afterAll(async () => {
      await Ranking.remove({})
      await Position.remove({})
    })
    test(' creates ranking with correct body', async() => {
      const body = testHelpers.getRankingBody()
      await rankingService.createRanking(body)
      const allRankings = await Ranking.find({})
      expect(allRankings.length).toBe(1)
    })
  })

  describe(' saveRankingToDataBase ', () => {
    beforeAll(async () => {
      await Ranking.remove({})
      await Position.remove({})
    })
    afterAll(async () => {
      await Ranking.remove({})
      await Position.remove({})
    })
    test(' adds correct amount of positions for ranking to DB', async() => {
      await saveRankingToDataBase()
      const allPositions = await Position.find({})
      expect(allPositions.length).toBe(7)
      const allRankings = await Ranking.find({})
      const savedRanking = allRankings[0]
      expect(savedRanking.positions.length).toEqual(7)
    })

  })

  describe(' getRankings ', () => {

    beforeAll(async () => {
      await Ranking.remove({})
      await Position.remove({})
      await saveRankingWithOnePosition();
      console.log('BEfORE ALL DESCRIBESSÄ')
    })

    afterAll(async() => {
      await Ranking.remove({})
      await Position.remove({})
    })

    test(' returns correct amount of rankings', async() => {
      const allRankings = await rankingService.getRankings()
      expect(allRankings.length).toEqual(1)
    })
    test(' ranking has correct amount of positions', async() => {
      const allRankings = await rankingService.getRankings()
      expect(allRankings[0].positions.length).toEqual(1)
    })
    test(' ranking has positions data populated correctly ', async() => {
      const allRankings = await rankingService.getRankings()
      const position = allRankings[0].positions[0]
      console.log('position', position)
      expect(position.position).toEqual(1)
      expect(position.rating).toEqual(1500)
    })
  })

  describe(' deleteRanking ', () => {

    beforeAll(async () => {
      await Ranking.remove({})
      await Position.remove({})
      await saveRankingWithOnePosition();
      console.log('BEfORE ALL DESCRIBESSÄ')
    })

    afterAll(async() => {
      await Ranking.remove({})
      await Position.remove({})
    })

    test(' deletes ranking and its positions from database', async() => {
      const rankingsBeforeDelete = await rankingService.getRankings()
      const firstRanking = rankingsBeforeDelete[0]
      await rankingService.deleteRanking(firstRanking.id)
      const rankingsAfterDelete = await rankingService.getRankings()
      expect(rankingsAfterDelete.length).toEqual(0)
      const positionsAfterDelete  = await Position.find({})
      expect(positionsAfterDelete.length).toEqual(0)
    })
  })
})

afterAll( async () => {
  await Ranking.remove({})
  await Position.remove({})
  await mongoose.connection.close()
  console.log('rankingService afterAll')
})