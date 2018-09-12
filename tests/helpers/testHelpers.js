const fs = require('fs');
const Position = require('../../models/position');
const Ranking = require('../../models/ranking');
const Player = require('../../models/player');
const fileService = require('../../services/fileService');
const rankingService = require('../../services/rankingService');

const getPositionModelBody = (rankingId, playerId) => {
  const positionBody = {
    clubName: 'TOP CLUB',
    playerName: 'Testi Testaaja',
    rating: 1421,
    position: 120,
    date: new Date(2018, 5, 15),
    ranking: rankingId,
    player: playerId,
  };
  return positionBody;
};

const getRankingModelBody = () => ({
  date: new Date(2018, 5, 15),
  competitionName: 'Test Competition',
});

const getPlayerModelBody = () => ({
  name: 'Testi Testinen',
});

const getRankingBody = () => {
  const rankingBody = {
    rankingDate: new Date(2018, 5, 15),
    rankingName: 'Test Rank',
  };
  return rankingBody;
};

const getRatingBase64 = () => {
  const result = fs.readFileSync('./tests/helpers/rating-files/spring/TestRatingFile.txt', 'utf8');
  return result;
};

const removePositionsAndRankingsAndPlayers = async () => {
  await Position.remove({});
  await Ranking.remove({});
  await Player.remove({});
};

const seedRatingExcelToDatabase = async () => {
  const body = getRankingBody();
  const base64 = getRatingBase64();
  const fileJson = fileService.convertBase64ToExcel(base64);
  await rankingService.saveRankingToDatabase(fileJson, body);
};

const apiTestTimeout = 10000;

module.exports = {
  getPositionModelBody,
  getRankingBody,
  getRankingModelBody,
  getRatingBase64,
  removePositionsAndRankingsAndPlayers,
  getPlayerModelBody,
  seedRatingExcelToDatabase,
  apiTestTimeout,
};
