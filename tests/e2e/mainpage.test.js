const puppeteer = require('puppeteer')

describe('When user visits main page ', () => {

  test(' it contains welcome message', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']})
    const page = await browser.newPage()
    await page.goto('http://localhost:3003')
    const textContent = await page.$eval('body', el => el.textContent)
    const includes = textContent.includes('Welcome to Ranking-app!')
    expect(includes).toBe(true)
    await browser.close()
  })
})