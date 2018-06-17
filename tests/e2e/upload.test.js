const puppeteer = require('puppeteer')
const User = require('../../models/user')
const seeder = require('../../db/seeds')
const config = require('../../utils/config')
const mongoose = require('mongoose')
const { login }  = require('./helper')

beforeAll(async () => {
  console.log('UPLOAD BEFORE ALL')
  mongoose.connect(config.MONGOLAB_URL)
  mongoose.Promise = global.Promise
  await User.remove({})
  await seeder.seedAdminToDataBase()
})

describe('When user goes to upload page ', () => {
  let browser
  let page
  
  beforeEach(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    page = await browser.newPage()
    await page.goto('http://localhost:3003/#/signin')
  })
 
  test.skip(' and is signed in, ranking form can be filled', async () => {
    await login(page, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    await page.goto('http://localhost:3003/#/upload')
    await page.waitForSelector('#fileDrop')
    await page.waitForSelector('input[type="file"]')
    await page.waitForSelector('.field')
    await page.waitForSelector('input')
    const fileEle = await page.$('input[type="file"]')
    await page.waitForSelector('#fileDrop')
    await page.waitForSelector('input[type="file"]')
    await page.waitForSelector('.field')
    await page.waitForSelector('input')
    await fileEle.uploadFile('./tests/helpers/TestRatingFile.xls')
    const content = await page.$eval('body', el => el.textContent)
    console.log('uploadin jälkeen', content)
    await page.waitForSelector('input[name=rankingName]')
    await page.type('input[name=rankingName]', 'Puppeteer Competition')
    await page.waitForSelector('button[type=submit]')
    await page.click('button[type=submit]')
    await page.waitForSelector('.success')
    const textContent = await page.$eval('body', el => el.textContent)
    console.log('textContent', textContent)
    const includes = textContent.includes('Ranking Puppeteer Competition was created succsefully!')
    expect(includes).toBeTruthy()
  },10000)

  test(' and is not signed in, loading files is not possible', async () => {
    await page.goto('http://localhost:3003/#/upload')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('excel')
    expect(includes).toBeFalsy()
  },10000)

  afterEach(async () => {
    await browser.close()
  })

})

afterAll( async () => {
  console.log('UPLOAD AFTER ALL')
  await User.remove({})
  await mongoose.connection.close()
  console.log('UPLOAD CONNECTION CLOSED!')
})