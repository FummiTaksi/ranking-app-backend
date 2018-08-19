const mongoose = require('mongoose');
const config = require('../../../utils/config');
const Position = require('../../../models/position');
const Ranking = require('../../../models/ranking');
const { getPositionModelBody, getRankingModelBody } = require('../../helpers/testHelpers');

beforeAll(async () => {
  await mongoose.connect(config.MONGOLAB_URL);
  mongoose.Promise = global.Promise;
});

describe('Position', () => {
  beforeEach(async () => {
    await Ranking.remove({});
    await Position.remove({});
  });

  test(' can be created with valid credentials', async () => {
    const positionModel = getPositionModelBody();
    const position = new Position(positionModel);
    await position.save();
    const allPositions = await Position.find({});
    expect(allPositions.length).toBe(1);
  });

  test(' belongs to Ranking', async () => {
    const rankingModel = getRankingModelBody();
    const ranking = new Ranking(rankingModel);
    const rankingSaveResponse = await ranking.save();
    const positionModel = getPositionModelBody(rankingSaveResponse._id);
    const position = new Position(positionModel);
    const positionSaveResponse = await position.save();
    expect(positionSaveResponse.ranking).toBe(rankingSaveResponse._id);
    const positionWithPopulatedRanking = await Position.findById(positionSaveResponse._id)
      .populate('ranking', { competitionName: 1 });
    const { competitionName } = positionWithPopulatedRanking.ranking;
    expect(competitionName).toEqual(rankingModel.competitionName);
  });
});

afterAll(async () => {
  await Position.remove({});
  await Ranking.remove({});
  await mongoose.connection.close();
});
