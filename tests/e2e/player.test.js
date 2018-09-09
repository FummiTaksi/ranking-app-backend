const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { timeout } = require('./helper');
const seeder = require('../../db/seeds');
const config = require('../../utils/config');
const User = require('../../models/user');
const Player = require('../../models/player');
const { removePositionsAndRankingsAndPlayers, seedRatingExcelToDatabase } = require('../helpers/testHelpers');

describe('When user visits players page ', () => {
  let browser;
  let page;
  beforeAll(async () => {
    mongoose.connect(config.MONGOLAB_URL);
    mongoose.Promise = global.Promise;
    await User.remove({});
    await removePositionsAndRankingsAndPlayers();
    await seeder.seedAdminToDataBase();
    await seedRatingExcelToDatabase();
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    page = await browser.newPage();
  });
  test(' it shows correct amount of players', async () => {
    await page.goto('http://localhost:3003/#/players');
    await page.waitForSelector('#playerList');
    const textContent = await page.$eval('body', el => el.textContent);
    const includes = textContent.includes('Showing 7 players that matched your search');
    expect(includes).toBe(true);
  }, timeout);
  test('players info is shown correctly', async () => {
    const players = await Player.find({});
    const firstPlayer = players[0];
    const playerId = firstPlayer._id;
    const { name } = firstPlayer;
    await page.goto(`http://localhost:3003/#/players/${playerId}`);
    await page.waitForSelector('#playerView');
    const textContent = await page.$eval('body', el => el.textContent);
    const includes = textContent.includes(`Statistics of ${name}`);
    expect(includes).toBe(true);
  }, timeout);

  afterAll(async () => {
    await browser.close();
    await User.remove({});
    await removePositionsAndRankingsAndPlayers();
    await mongoose.connection.close();
  });
});
