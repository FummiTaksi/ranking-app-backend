const puppeteer = require('puppeteer')

describe('When app is running', async() => {
  test(' main page contains welcome message', async () => {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    await page.goto('http://localhost:3003')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Welcome to RankingApp!')
    expect(includes).toBe(true)
    await browser.close()
  })
})