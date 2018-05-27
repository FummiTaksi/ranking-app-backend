const puppeteer = require('puppeteer')
const User = require('../models/user')
const seeder = require('../db/seeds')
const config = require('../utils/config')
const mongoose = require('mongoose')

beforeAll(async () => {
  console.log('UPLOAD BEFORE ALL')
  mongoose.connect(config.MONGOLAB_URL)
  mongoose.Promise = global.Promise
  await User.remove({})
  await seeder.seedAdminToDataBase()
})

describe('When user goes to upload page ', async() => {
  let browser
  let page
  
  beforeEach(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    page = await browser.newPage()
    await page.goto('http://localhost:3003/#/signin')
  })
 
  test(' and is signed in, loading files is possible', async () => {
    await login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    await page.goto('http://localhost:3003/#/upload')
    await page.waitForSelector('h3')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Drop excel file to create new ranking')
    expect(includes).toBeTruthy()
  },10000)

  test(' and is not signed in, loading files is not possible', async () => {
    await page.goto('http://localhost:3003/#/upload')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('excel')
    expect(includes).toBeFalsy()
  },10000)

  const login = async(username, password) => {
    await page.type('input', username)
    await page.type('input[type=password]', password)
    await page.click('button')
  }

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