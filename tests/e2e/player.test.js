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
  beforeAll(async () => {
    mongoose.connect(config.MONGOLAB_URL);
    mongoose.Promise = global.Promise;
    await User.remove({});
    await removePositionsAndRankingsAndPlayers();
    await seeder.seedAdminToDataBase();
    await seedRatingExcelToDatabase();
  });
  test(' it shows correct amount of players', async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://localhost:3003/#/players');
    await page.waitForSelector('#playerList', { options: { visible: true } });
    const textContent = await page.$eval('body', el => el.textContent);
    const includes = textContent.includes('Showing 7 players that matched your search');
    expect(includes).toBe(true);
  }, timeout);
  test('players info is shown correctly', async () => {
    const players = await Player.find({});
    const firstPlayer = players[0];
    const playerId = firstPlayer._id;
    const { name } = firstPlayer;
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`http://localhost:3003/#/players/${playerId}`);
    await page.waitForSelector('h2', { options: { visible: true } });
    const textContent = await page.$eval('body', el => el.textContent);
    const includes = textContent.includes(`Statistics of ${name}`);
    expect(includes).toBe(true);
  }, timeout);
  afterEach(async () => {
    await browser.close();
  });
  afterAll(async () => {
    await User.remove({});
    await removePositionsAndRankingsAndPlayers();
    await mongoose.connection.close();
  });
});
