const login = async(page, username, password) => {
  await page.type('input', username)
  await page.type('input[type=password]', password)
  await page.click('button')
}

module.exports = { login }