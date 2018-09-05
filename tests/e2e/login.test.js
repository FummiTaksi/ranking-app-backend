const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const User = require('../../models/user');
const seeder = require('../../db/seeds');
const config = require('../../utils/config');
const { login, timeout } = require('./helper');

beforeAll(async () => {
  mongoose.connect(config.MONGOLAB_URL);
  mongoose.Promise = global.Promise;
  await User.remove({});
  await seeder.seedAdminToDataBase();
});

describe('When user goest to login page ', () => {
  let browser;
  let page;
  beforeEach(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    page = await browser.newPage();
    await page.goto('http://localhost:3003/#/signin');
  });
  test(' it tells user signing in is only for admin', async () => {
    const textContent = await page.$eval('body', el => el.textContent);
    const includes = textContent.includes('Signing in is only available for admin!');
    expect(includes).toBe(true);
  }, timeout);

  test(' and fills wrong credentials, login fails', async () => {
    await login(page, process.env.ADMIN_USERNAME, 'wrongPassword');
    await page.waitForSelector('.success');
    const textContent = await page.$eval('body', el => el.textContent);
    const includes = textContent.includes('Wrong username or password!');
    expect(includes).toBe(true);
  }, timeout);

  test(' and fills correct credentials, login succeeds', async () => {
    await login(page, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    await page.waitForSelector('.success');
    const textContent = await page.$eval('body', el => el.textContent);
    const includes = textContent.includes('You are logged in as Admin');
    expect(includes).toBe(true);
  }, timeout);

  afterEach(async () => {
    await browser.close();
  });
});

afterAll(async () => {
  await User.remove({});
  await mongoose.connection.close();
});
