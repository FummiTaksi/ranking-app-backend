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

module.exports = { getPositionBody, getRankingBody }