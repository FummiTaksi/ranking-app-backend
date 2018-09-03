const supertest = require('supertest');
const { app, server } = require('../../../index');
const Player = require('../../../models/player');
const Position = require('../../../models/position');
const { getPlayerModelBody, getPositionModelBody, removePositionsAndRankingsAndPlayers } = require('../../helpers/testHelpers');

const api = supertest(app);

describe('/api/players', () => {
  beforeAll(async () => {
    await removePositionsAndRankingsAndPlayers();
  });

  describe('GET', () => {
    let response;
    const playerModel = getPlayerModelBody();
    let positionModel;
    let players;
    let player;
    beforeAll(async () => {
      positionModel = getPositionModelBody();
      const position = new Position(positionModel);
      const positionSaveResponse = await position.save();
      playerModel.positions = [positionSaveResponse];
      const model = new Player(playerModel);
      await model.save();
      response = await api.get('/api/players');
      ({ players } = response.body);
      ([player] = players);
    });
    test('status is 200', () => {
      expect(response.status).toEqual(200);
    });
    test('returns correct amount of players', () => {
      expect(players.length).toEqual(1);
    });
    test('has correct player information', () => {
      expect(player.name).toEqual(playerModel.name);
    });
    test('player has correct position', () => {
      const { positions } = player;
      expect(positions.length).toEqual(1);
      expect(positions[0].rating).toEqual(positionModel.rating);
    });
  });

  afterAll(async () => {
    await removePositionsAndRankingsAndPlayers();
    server.close();
  });
});
