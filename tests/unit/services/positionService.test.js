const mongoose = require('mongoose');
const config = require('../../../utils/config');
const Position = require('../../../models/position');
const Ranking = require('../../../models/ranking');
const rankingService = require('../../../services/rankingService');
const positionService = require('../../../services/positionService');
const { getRankingBody, getPositionModelBody } = require('../../helpers/testHelpers');

beforeAll(async () => {
  await mongoose.connect(config.MONGOLAB_URL);
});

describe('rankingService ', () => {
  describe(' createPosition ', () => {
    test(' creates position which has ranking attached to it', async () => {
      const rankingBody = getRankingBody();
      const rankingSaveResponse = await rankingService.createRanking(rankingBody);
      const positionBody = getPositionModelBody(rankingSaveResponse._id);
      await positionService.createPosition(positionBody);
      const allPositions = await Position.find({});
      expect(allPositions.length).toBe(1);
      const savedPosition = allPositions[0];
      expect(savedPosition.playerName).toEqual(positionBody.playerName);
      expect(savedPosition.ranking).toEqual(rankingSaveResponse._id);
    });
  });
});

afterAll(async () => {
  await Position.remove({});
  await Ranking.remove({});
  await mongoose.connection.close();
});
