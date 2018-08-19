const fs = require('fs');
const Position = require('../../models/position');
const Ranking = require('../../models/ranking');

const getPositionModelBody = (rankingId) => {
  const positionBody = {
    playerName: 'Testi Testaaja',
    clubName: 'TOP CLUB',
    rating: 1421,
    position: 120,
    ranking: rankingId,
  };
  return positionBody;
};

const getRankingModelBody = () => ({
  date: Date.now(),
  competitionName: 'Test Competition',
});

const getRankingBody = () => {
  const rankingBody = {
    rankingDate: Date.now(),
    rankingName: 'Test Rank',
  };
  return rankingBody;
};

const getRatingBase64 = () => {
  const result = fs.readFileSync('./tests/helpers/TestRatingFile.txt', 'utf8');
  return result;
};

const removePositionsAndRankings = async () => {
  await Position.remove({});
  await Ranking.remove({});
};

module.exports = {
  getPositionModelBody,
  getRankingBody,
  getRankingModelBody,
  getRatingBase64,
  removePositionsAndRankings,
};
