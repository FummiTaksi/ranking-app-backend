const fs = require('fs')

const getPositionBody = (rankingId) => {
  const positionBody = {
    playerName: 'Testi Testaaja',
    clubName: 'TOP CLUB',
    rating: 1421,
    position: 120,
    ranking: rankingId
  }
  return positionBody
}

const getRankingBody = () => {
  const rankingBody = {
    rankingDate: Date.now(),
    rankingName: 'Test Rank'
  }
  return rankingBody
}

const getRatingBase64 = () => {
  const result = fs.readFileSync('./tests/helpers/TestRatingFile.txt', 'utf8')
  return result
}

module.exports = { getPositionBody, getRankingBody, getRatingBase64 }