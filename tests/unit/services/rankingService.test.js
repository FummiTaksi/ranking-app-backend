const mongoose = require('mongoose')
const config = require('../../../utils/config')
const Ranking = require('../../../models/ranking')
const Position = require('../../../models/position')
const rankingService = require('../../../services/rankingService')
const fileService = require('../../../services/fileService')
const { getRankingBody, getRatingBase64,
  getRankingModelBody, getPositionModelBody,
  removePositionsAndRankings } = require('../../helpers/testHelpers')

beforeAll(async () => {
  await mongoose.connect(config.MONGOLAB_URL)
})

const saveRankingToDataBase = async () => {
  const body = getRankingBody()
  const base64 = getRatingBase64()
  const fileJson = fileService.convertBase64ToExcel(base64)
  await rankingService.saveRankingToDatabase(fileJson, body)
}

const saveRankingWithOnePosition = async () => {
  const rankingModel = getRankingModelBody()
  const ranking = new Ranking(rankingModel)
  const savedRanking = await ranking.save()
  const positionModel = getPositionModelBody(savedRanking._id)
  const position = new Position(positionModel)
  const positionSaveResponse = await position.save()
  rankingModel.positions = [positionSaveResponse._id]
  await Ranking.findByIdAndUpdate(savedRanking._id, rankingModel)
}

describe('rankingService ', () => {

  describe(' createRanking ', () => {
    beforeAll(async () => {
      await removePositionsAndRankings()
    })
    afterAll(async () => {
      await removePositionsAndRankings()
    })
    test(' creates ranking with correct body', async() => {
      const body = getRankingBody()
      await rankingService.createRanking(body)
      const allRankings = await Ranking.find({})
      expect(allRankings.length).toBe(1)
    })
  })

  describe(' saveRankingToDataBase ', () => {
    beforeAll(async () => {
      await removePositionsAndRankings()
    })
    afterAll(async () => {
      await removePositionsAndRankings()
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
      await removePositionsAndRankings()
      await saveRankingWithOnePosition()
    })

    afterAll(async() => {
      await removePositionsAndRankings()
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
      const positionModel = getPositionModelBody()
      expect(position.position).toEqual(positionModel.position)
      expect(position.rating).toEqual(positionModel.rating)
    })
  })

  describe(' deleteRanking ', () => {

    beforeAll(async () => {
      await removePositionsAndRankings()
      await saveRankingWithOnePosition()
    })

    afterAll(async() => {
      await removePositionsAndRankings()
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
  await removePositionsAndRankings()
  await mongoose.connection.close()
})