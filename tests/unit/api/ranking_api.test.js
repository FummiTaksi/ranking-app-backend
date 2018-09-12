const supertest = require('supertest');
const { app, server } = require('../../../index');
const User = require('../../../models/user');
const seeder = require('../../../db/seeds');
const { getRatingBase64, removePositionsAndRankingsAndPlayers, apiTestTimeout } = require('../../helpers/testHelpers');

const api = supertest(app);


const emptyDatabase = async () => {
  await User.remove({});
  await removePositionsAndRankingsAndPlayers();
};


beforeAll(async () => {
  await emptyDatabase();
  await seeder.seedAdminToDataBase();
});

const getCorrectToken = async () => {
  const correctCredentials = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  };
  const response = await api.post('/api/login').send(correctCredentials);
  return response.body.token;
};

const correctCredentials = () => {
  const base64 = getRatingBase64();
  return {
    rankingFileBase64: base64,
    rankingName: 'Test Cup',
    rankingDate: new Date(),
  };
};

const postNewRanking = async (credentials, token) => {
  const rankingResponse = await api
    .post('/api/ranking/new')
    .send(credentials)
    .set('Authorization', `bearer ${token}`);
  return rankingResponse;
};

describe('/api/ranking', () => {
  describe('/new', () => {
    describe(' returns 400 when ', () => {
      test(' token is not correct', async () => {
        const response = await postNewRanking(correctCredentials(), 'bearer wrongtoken');
        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('You must be signed in admin to create new ranking!');
      }, apiTestTimeout);
      test(' body is missing rankingName', async () => {
        const missingRankingName = correctCredentials();
        missingRankingName.rankingName = undefined;
        const token = await getCorrectToken();
        const rankingResponse = await postNewRanking(missingRankingName, token);
        expect(rankingResponse.status).toEqual(400);
        expect(rankingResponse.body.error).toEqual('Ranking must have a name!');
      }, apiTestTimeout);
      test(' body is missing rankingDate', async () => {
        const missingRankingDate = correctCredentials();
        missingRankingDate.rankingDate = undefined;
        const token = await getCorrectToken();
        const rankingResponse = await postNewRanking(missingRankingDate, token);
        expect(rankingResponse.status).toEqual(400);
        expect(rankingResponse.body.error).toEqual('Ranking must have a date!');
      }, apiTestTimeout);
    });

    describe(' returns 200 when ', () => {
      test(' body contains correct credentials', async () => {
        const token = await getCorrectToken();
        const response = await postNewRanking(correctCredentials(), token);
        expect(response.status).toEqual(200);
        expect(response.body.ranking.competitionName).toEqual('Test Cup');
      }, apiTestTimeout);
    });
  });

  describe(' GET /', () => {
    beforeAll(async () => {
      await removePositionsAndRankingsAndPlayers();
    });
    test(' returns status 200 and correct amount of rankings ', async () => {
      const token = await getCorrectToken();
      await postNewRanking(correctCredentials(), token);
      const response = await api.get('/api/ranking/').expect(200);
      expect(response.body.rankings.length).toEqual(1);
    }, apiTestTimeout);

    test(' returns correct type of positions', async () => {
      const token = await getCorrectToken();
      await postNewRanking(correctCredentials(), token);
      const response = await api.get('/api/ranking/').expect(200);
      expect(response.body.rankings[0].positions[0].playerName).toEqual('Ykkös Ykkönen');
    }, apiTestTimeout);

    afterAll(async () => {
      await removePositionsAndRankingsAndPlayers();
    });
  });

  describe(' DELETE /:id ', () => {
    beforeAll(async () => {
      await removePositionsAndRankingsAndPlayers();
    });
    describe('returns 400 when', () => {
      test(' token is not correct', async () => {
        const token = await getCorrectToken();
        const response = await postNewRanking(correctCredentials(), token);
        const rankingId = response.body.ranking._id;
        await api.delete(`/api/ranking/${rankingId}`).set('Authorization', 'bearer wrongtoken ').expect(400);
      }, apiTestTimeout);
    });
    describe('when given correct credentials', () => {
      test('status is 200 and body contains deletedRanking', async () => {
        const token = await getCorrectToken();
        const response = await postNewRanking(correctCredentials(), token);
        const rankingId = response.body.ranking._id;
        const deleteResponse = await api.delete(`/api/ranking/${rankingId}`).set('Authorization', `bearer ${token}`).expect(200);
        expect(deleteResponse.body.deletedRanking).toBeDefined();
      }, apiTestTimeout);
    });
  });

  describe(' GET /:id ', () => {
    beforeAll(async () => {
      await removePositionsAndRankingsAndPlayers();
    });
    describe('returns 400 when', () => {
      test(' ranking is not found', async () => {
        const token = await getCorrectToken();
        await postNewRanking(correctCredentials(), token);
        await api.get('/api/ranking/wrongId').expect(400);
      }, apiTestTimeout);
    });
    describe('when given correct credentials', () => {
      test('status is 200 and body contains correct ranking', async () => {
        const token = await getCorrectToken();
        const response = await postNewRanking(correctCredentials(), token);
        const rankingId = response.body.ranking._id;
        const getResponse = await api.get(`/api/ranking/${rankingId}`).expect(200);
        expect(getResponse.body.ranking).toBeDefined();
      }, apiTestTimeout);
    });
  });
});


afterAll(async () => {
  await emptyDatabase();
  server.close();
});
