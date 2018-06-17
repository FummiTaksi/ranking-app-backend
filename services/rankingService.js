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

const addPositionToRanking = async(rankingId, position) => {
  const rankingToBeUpdated = await Ranking.findById(rankingId)
  const rankingModel = {
    competitionName: rankingToBeUpdated.competitionName,
    date: rankingToBeUpdated.date,
    positions: rankingToBeUpdated.positions.concat(position)
  }
  const response = await Ranking.findByIdAndUpdate(rankingId, rankingModel)
  return response
}

const saveRankingToDatabase = async(rankingJson, rankingBody) => {
  const nameString= 'Pelaajalla pitää olla vähintään yksi kisatulos (Kevät-18 tai Syksy-17) jotta näkyisi tällä listalla'
  const noMorePlayers = 'Seuraavilla pelaajilla on rating mutta ei yhtään kisatulosta (Kevät-18 tai Syksy-17) eli eivät mukana ylläolevalla listalla'
  const createdRanking = await createRanking(rankingBody)
  rankingJson.every(async function(element, index)  {
    if (index > 1) {
      if (element[nameString] === noMorePlayers) {
        return false
      }
      const positionBody = convertColumnToRankingObject(element)
      positionBody.ranking = createdRanking._id
      const savedPosition = await positionService.createPosition(positionBody)
      const updatedRanking = await addPositionToRanking(createdRanking._id, savedPosition)
      console.log('updatedRanking', updatedRanking)
    }
    return true
  })
  const savedRanking = await Ranking.findById(createdRanking._id)
  return savedRanking
}

module.exports = { saveRankingToDatabase , createRanking, addPositionToRanking }