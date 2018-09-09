const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const User = require('../../models/user');
const Ranking = require('../../models/ranking');
const Position = require('../../models/position');
const seeder = require('../../db/seeds');
const config = require('../../utils/config');
const { login, uploadRanking, timeout } = require('./helper');
const rankingService = require('../../services/rankingService');
const { getRankingBody } = require('../helpers/testHelpers');

describe('When user goes to upload page ', () => {
  let browser;
  let page;

  beforeAll(async () => {
    mongoose.connect(config.MONGOLAB_URL);
    mongoose.Promise = global.Promise;
    await Ranking.remove({});
    await Position.remove({});
    await User.remove({});
    await seeder.seedAdminToDataBase();
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    page = await browser.newPage();
  });

  describe(' and is signed in', () => {
    beforeAll(async () => {
      await Ranking.remove({});
      await Position.remove({});
      await page.goto('http://localhost:3003/#/signin');
      await login(page, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    });

    test(' ranking can be created', async () => {
      await uploadRanking(page);
      await page.goto('http://localhost:3003/#/rankings');
      await page.waitForSelector('#rankingList');
      const textContent = await page.$eval('body', el => el.textContent);
      const includes = textContent.includes('Here are all 1 rankings that are uploaded to this site');
      expect(includes).toBeTruthy();
    }, timeout);

    test(' ranking can be deleted', async () => {
      const body = getRankingBody();
      await rankingService.createRanking(body);
      await page.goto('http://localhost:3003/#/rankings');
      await page.waitForSelector('.delete');
      await page.click('.delete');
      await page.waitForSelector('#noRankings');
      const textContent = await page.$eval('body', el => el.textContent);
      const includes = textContent.includes('No rankings saved to database yet');
      expect(includes).toBeTruthy();
    }, timeout);
  });

  describe(' and is not signed in', () => {
    beforeAll(async () => {
      await Ranking.remove({});
      await Position.remove({});
      const body = getRankingBody();
      await rankingService.createRanking(body);
      await page.waitForSelector('#logOut');
      await page.click('#logOut');
    });

    test(' loading files is not possible', async () => {
      await page.goto('http://localhost:3003/#/upload');
      const textContent = await page.$eval('body', el => el.textContent);
      const includes = textContent.includes('excel');
      expect(includes).toBeFalsy();
    }, timeout);

    test('deleting rankings is not possible', async () => {
      await page.goto('http://localhost:3003/#/rankings');
      await page.waitForSelector('#rankingList');
      const textContent = await page.$eval('body', el => el.textContent);
      const includes = textContent.includes('Delete');
      expect(includes).toBeFalsy();
    }, timeout);
  });

  afterAll(async () => {
    await browser.close();
    await User.remove({});
    await mongoose.connection.close();
  });
});
