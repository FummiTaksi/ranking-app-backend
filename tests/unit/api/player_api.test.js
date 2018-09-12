const supertest = require('supertest');
const { app, server } = require('../../../index');
const Player = require('../../../models/player');
const Position = require('../../../models/position');
const {
  getPlayerModelBody, getPositionModelBody, removePositionsAndRankingsAndPlayers, apiTestTimeout,
} = require('../../helpers/testHelpers');

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
    afterAll(async () => {
      await removePositionsAndRankingsAndPlayers();
    });
  });

  describe('/:id GET', () => {
    let saveResponse;
    describe(' when id matches player', () => {
      let response;
      const playerModel = getPlayerModelBody();
      let player;
      let positionModel;
      beforeAll(async () => {
        positionModel = getPositionModelBody();
        const position = new Position(positionModel);
        const positionSaveResponse = await position.save();
        playerModel.positions = [positionSaveResponse];
        const model = new Player(playerModel);
        saveResponse = await model.save();
        response = await api.get(`/api/players/${saveResponse._id}`);
        ({ player } = response.body);
      });
      test('status is 200', () => {
        expect(response.status).toEqual(200);
      }, apiTestTimeout);
      test('has correct player information', () => {
        expect(player.name).toEqual(playerModel.name);
      }, apiTestTimeout);
      test('player has correct position', () => {
        const { positions } = player;
        expect(positions.length).toEqual(1);
        expect(positions[0].rating).toEqual(positionModel.rating);
      }, apiTestTimeout);
      afterAll(async () => {
        await removePositionsAndRankingsAndPlayers();
      });
    });

    describe('when id dont match any players', () => {
      let response;
      let player;
      beforeAll(async () => {
        response = await api.get(`/api/players/${saveResponse._id}`);
        ({ player } = response.body);
      });
      test('status is 200', () => {
        expect(response.status).toEqual(200);
      }, apiTestTimeout);
      test('player is null', () => {
        expect(player).toBeNull();
      }, apiTestTimeout);
    });
    afterAll(async () => {
      await removePositionsAndRankingsAndPlayers();
    });
  });
  afterAll(async () => {
    await removePositionsAndRankingsAndPlayers();
    server.close();
  });
});
