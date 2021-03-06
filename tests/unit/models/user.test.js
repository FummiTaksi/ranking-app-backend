const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../../../utils/config');
const User = require('../../../models/user');

beforeAll(async () => {
  await mongoose.connect(config.MONGOLAB_URL);
});

describe('User', () => {
  beforeEach(async () => {
    await User.remove({});
  });

  const getCorrectUser = async () => {
    const passwordHash = await bcrypt.hash('password', 10);
    return {
      username: 'User1',
      passwordHash,
      admin: true,
    };
  };
  test(' can be created with valid credentials', async () => {
    const userModel = await getCorrectUser();
    const user = new User(userModel);
    await user.save();
    const allUsers = await User.find({});
    expect(allUsers.length).toBe(1);
  });
});

afterAll(async () => {
  await User.remove({});
  await mongoose.connection.close();
});
