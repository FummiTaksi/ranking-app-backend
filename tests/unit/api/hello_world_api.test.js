const supertest = require('supertest');
const { app, server } = require('../../../index');
const { apiTestTimeout } = require('../../helpers/testHelpers');
const User = require('../../../models/user');
const seeder = require('../../../db/seeds');

const api = supertest(app);

beforeAll(async () => {
  await User.remove({});
  await seeder.seedAdminToDataBase();
});

describe('When app is running', () => {
  test(' main route returns 200', async () => {
    await api
      .get('/')
      .expect(200);
  }, apiTestTimeout);

  test(' admin is created successfully', async () => {
    const users = await User.find({});
    expect(users.length).toEqual(1);
    expect(users[0].username).toEqual(process.env.ADMIN_USERNAME);
  }, apiTestTimeout);
});


afterAll(async () => {
  await User.remove({});
  server.close();
});
