const puppeteer = require('puppeteer')

describe('When user visits main page ', async() => {

  test(' it contains welcome message', async () => {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    await page.goto('http://localhost:3003')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Welcome to RankingApp!')
    expect(includes).toBe(true)
    await browser.close()
  })
})