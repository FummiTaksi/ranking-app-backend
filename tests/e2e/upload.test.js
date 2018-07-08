const puppeteer = require('puppeteer')
const User = require('../../models/user')
const Ranking = require('../../models/ranking')
const Position = require('../../models/position')
const seeder = require('../../db/seeds')
const config = require('../../utils/config')
const mongoose = require('mongoose')
const { login, uploadRanking }  = require('./helper')

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
    await Ranking.remove({})
    await Position.remove({})
    browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    page = await browser.newPage()
    await page.goto('http://localhost:3003/#/signin')
  })

  describe(' and is signed in', () => {

    beforeEach(async () => {
      await Ranking.remove({})
      await Position.remove({})
      browser = await puppeteer.launch({ args: ['--no-sandbox'] })
      page = await browser.newPage()
      await page.goto('http://localhost:3003/#/signin')
    })

    test(' ranking form can be filled', async () => {
      await login(page, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
      await uploadRanking(page)
      await page.goto('http://localhost:3003/#/rankings')
      await page.waitForSelector('h3')
      const textContent = await page.$eval('body', el => el.textContent)
      const includes = textContent.includes('Here are all 1 rankings that are uploaded to this site')
      expect(includes).toBeTruthy()
    },10000)

    test(' ranking can be deleted', async () => {
      await login(page, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
      await uploadRanking(page)
      await page.goto('http://localhost:3003/#/rankings')
      await page.waitForSelector('.delete')
      await page.click('.delete')
      await page.waitFor(5000)
      await page.waitForSelector('p')
      const textContent = await page.$eval('body', el => el.textContent)
      const includes = textContent.includes('No rankings saved to database yet')
      expect(includes).toBeTruthy()
    },10000)

  })
 
  describe(' and is not signed in', () => {

    beforeEach(async () => {
      await Ranking.remove({})
      await Position.remove({})
      browser = await puppeteer.launch({ args: ['--no-sandbox'] })
      page = await browser.newPage()
      await page.goto('http://localhost:3003/#/signin')
    })

    test(' loading files is not possible', async () => {
      await page.goto('http://localhost:3003/#/upload')
      const textContent = await page.$eval('body', el => el.textContent)
      const includes = textContent.includes('excel')
      expect(includes).toBeFalsy()
    },10000)

    test('deleting rankings is not possible', async() => {
      await login(page, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
      await uploadRanking(page)
      await page.click('button')
      await page.goto('http://localhost:3003/#/rankings')
      await page.waitFor(3000)
      await page.waitForSelector('p')
      const textContent = await page.$eval('body', el => el.textContent)
      const includes = textContent.includes('Delete')
      expect(includes).toBeFalsy()
    },10000)
  })


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