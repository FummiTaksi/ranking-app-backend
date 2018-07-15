const Ranking = require('../models/ranking')
const positionService = require('./positionService')

const convertColumnToRankingObject = (column) => {
  const nameString= 'Pelaajalla pitää olla vähintään yksi kisatulos (Kevät-18 tai Syksy-17) jotta näkyisi tällä listalla'
  const positionString = '__EMPTY'
  const clubString = '__EMPTY_3'
  const ratingString = '__EMPTY_4'
  return {
    playerName: column[nameString],
    position: column[positionString],
    clubName: column[clubString],
    rating: column[ratingString]
  }
}

const createRanking = async(rankingBody) => {
  const rankingModel = {
    competitionName: rankingBody.rankingName,
    date: rankingBody.rankingDate
  }
  const ranking = new Ranking(rankingModel)
  const response = await ranking.save()
  return response
}

const deleteRanking = async(rankingId) => {
  const ranking = await getRanking(rankingId)
  const removed =  await ranking.remove()
  return removed
}

const getRanking = async(rankingId) => {
  const ranking = await Ranking.findById(rankingId).populate('positions', { position: 1, rating: 1, playerName: 1, clubName: 1 })
  return ranking
}

const returnPositionList = async(rankingJson, rankingId) => {
  const nameString= 'Pelaajalla pitää olla vähintään yksi kisatulos (Kevät-18 tai Syksy-17) jotta näkyisi tällä listalla'
  const noMorePlayers = 'Seuraavilla pelaajilla on rating mutta ei yhtään kisatulosta (Kevät-18 tai Syksy-17) eli eivät mukana ylläolevalla listalla'
  let allPlayersSaved = false
  return rankingJson.reduce(async(positionListPromise, element, index) => {
    const positionList = await positionListPromise
    if (index > 1 && !allPlayersSaved) {
      if (element[nameString] === noMorePlayers) {
        allPlayersSaved = true
        return positionList
      }
      const positionBody = convertColumnToRankingObject(element)
      positionBody.ranking = rankingId
      const savedPosition = await positionService.createPosition(positionBody)
      positionList.push(savedPosition._id)
    }
    return positionList
  },Promise.resolve([]))
}
const saveRankingToDatabase = async(rankingJson, rankingBody) => {
  const createdRanking = await createRanking(rankingBody)
  const positions = await returnPositionList(rankingJson, createdRanking._id)
  createdRanking.positions = positions
  const updatedRanking = await Ranking.findByIdAndUpdate(createdRanking._id, createdRanking)
  return updatedRanking
}

const getRankings = async() => {
  const allRankings = await Ranking.find({}).populate('positions', { position: 1, rating: 1, playerName: 1, clubName: 1 })
  return allRankings
}

module.exports = { saveRankingToDatabase , createRanking, deleteRanking, getRankings, getRanking }