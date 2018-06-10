const puppeteer = require('puppeteer')
const User = require('../../models/user')
const seeder = require('../../db/seeds')
const config = require('../../utils/config')
const mongoose = require('mongoose')
const { login }  = require('./helper')

beforeAll(async () => {
  console.log('LOGIN TEST BEFOREALL ',config.MONGOLAB_URL)
  mongoose.connect(config.MONGOLAB_URL)
  mongoose.Promise = global.Promise
  await User.remove({})
  await seeder.seedAdminToDataBase()
})

describe('When user goest to login page ', () => {
  let browser
  let page
  
  beforeEach(async () => {
    browser = await puppeteer.launch({args: ['--no-sandbox']})
    page = await browser.newPage()
    await page.goto('http://localhost:3003/#/signin')
  })
  test(' it tells user signing in is only for admin', async () => {
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Signing in is only available for admin!')
    expect(includes).toBe(true)
  })

  test(' and fills wrong credentials, login fails', async () => {
    await login(page, process.env.ADMIN_USERNAME, 'wrongPassword')
    await page.waitForSelector('.success')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Wrong username or password!')
    expect(includes).toBe(true)
  },10000)

  test(' and fills correct credentials, login succeeds', async () => {
    await login(page, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    await page.waitForSelector('.success')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Welcome back Admin!')
    expect(includes).toBe(true)
  },10000)

  afterEach(async () => {
    await browser.close()
  })

})

afterAll( async () => {
  console.log('LOGIN TEST AFTERALL')
  await User.remove({})
  await mongoose.connection.close()
  console.log('LOGIN CONNECTION CLOSED!')
})