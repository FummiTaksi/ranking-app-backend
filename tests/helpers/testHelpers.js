const fs = require('fs');
const Position = require('../../models/position');
const Ranking = require('../../models/ranking');
const Player = require('../../models/player');

const getPositionModelBody = (rankingId, playerId) => {
  const positionBody = {
    clubName: 'TOP CLUB',
    playerName: 'Testi Testaaja',
    rating: 1421,
    position: 120,
    ranking: rankingId,
    player: playerId,
  };
  return positionBody;
};

const getRankingModelBody = () => ({
  date: Date.now(),
  competitionName: 'Test Competition',
});

const getPlayerModelBody = () => ({
  name: 'Testi Testinen',
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

const removePositionsAndRankingsAndPlayers = async () => {
  await Position.remove({});
  await Ranking.remove({});
  await Player.remove({});
};

module.exports = {
  getPositionModelBody,
  getRankingBody,
  getRankingModelBody,
  getRatingBase64,
  removePositionsAndRankingsAndPlayers,
  getPlayerModelBody,
};
