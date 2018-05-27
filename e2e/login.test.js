const puppeteer = require('puppeteer')

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

  afterEach(async () => {
    await browser.close()
  })
})