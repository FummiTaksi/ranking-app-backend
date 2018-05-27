const puppeteer = require('puppeteer')
const User = require('../models/user')
const seeder = require('../db/seeds')
const config = require('../utils/config')
const mongoose = require('mongoose')

beforeAll(async () => {
  console.log('CONNECTING to ',config.MONGOLAB_URL)
  mongoose.connect(config.MONGOLAB_URL)
  mongoose.Promise = global.Promise
  await User.remove({})
  await seeder.seedAdminToDataBase()
})

describe('When user goest to login page ', async() => {
  let browser
  let page
  
  beforeEach(async () => {
    browser = await puppeteer.launch({})
    page = await browser.newPage()
    await page.goto('http://localhost:3003/#/signin')
  })
  test(' it tells user signing in is only for admin', async () => {
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Signing in is only available for admin!')
    expect(includes).toBe(true)
  })

  test(' and fills wrong credentials, login fails', async () => {
    await login(process.env.ADMIN_USERNAME, 'wrongPassword')
    await page.waitForSelector('.success')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Wrong username or password!')
    expect(includes).toBe(true)
  },10000)

  test(' and fills correct credentials, login succeeds', async () => {
    await login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    await page.waitForSelector('.success')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Welcome back Admin!')
    expect(includes).toBe(true)
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
  await User.remove({})
  mongoose.connection.close()
})