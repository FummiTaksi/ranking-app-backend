const Ranking = require('../models/ranking')

const convertColumnToRankingObject = (column) => {
  const nameString= 'Pelaajalla pitää olla vähintään yksi kisatulos (Kevät-18 tai Syksy-17) jotta näkyisi tällä listalla'
  const positionString = '__EMPTY'
  const clubString = '__EMPTY_3'
  const ratingString = '__EMPTY_4'
  return {
    name: column[nameString],
    position: column[positionString],
    club: column[clubString],
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

const saveRankingToDatabase = async(rankingJson, rankingBody) => {
  const nameString= 'Pelaajalla pitää olla vähintään yksi kisatulos (Kevät-18 tai Syksy-17) jotta näkyisi tällä listalla'
  const noMorePlayers = 'Seuraavilla pelaajilla on rating mutta ei yhtään kisatulosta (Kevät-18 tai Syksy-17) eli eivät mukana ylläolevalla listalla'
  const createdRanking = await createRanking(rankingBody)
  rankingJson.every(function(element, index)  {
    if (index > 2) {
      if (element[nameString] === noMorePlayers) {
        console.log('RANKING ENDED')
        return false
      }
      const object = convertColumnToRankingObject(element)
      console.log(object)
    }
    return true
  })
}

module.exports = { saveRankingToDatabase , createRanking }