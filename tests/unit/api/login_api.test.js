const supertest = require('supertest');
const { app, server } = require('../../../index');
const seeder = require('../../../db/seeds');
const User = require('../../../models/user');
const { apiTestTimeout } = require('../../helpers/testHelpers');

const api = supertest(app);


beforeAll(async () => {
  await User.remove({});
  await seeder.seedAdminToDataBase();
});

describe('/api/login', () => {
  test('with wrong credentials, access is denied', async () => {
    const wrongCredentials = {
      username: process.env.ADMIN_USERNAME,
      password: 'ASF',
    };
    await api
      .post('/api/login')
      .send(wrongCredentials)
      .expect(403)
      .expect('Content-Type', /application\/json/);
  }, apiTestTimeout);
  describe('with correct credentials ', async () => {
    const correctCredentials = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };
    test(' status is 200', async () => {
      await api
        .post('/api/login')
        .send(correctCredentials)
        .expect(200);
    }, apiTestTimeout);
    test(' admin status is returned', async () => {
      const response = await api.post('/api/login').send(correctCredentials);
      expect(response.body.admin).toBe(true);
    }, apiTestTimeout);
  });
});

afterAll(async () => {
  await User.remove({});
  server.close();
});
