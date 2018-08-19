const login = async (page, username, password) => {
  await page.type('input', username);
  await page.type('input[type=password]', password);
  await page.click('button');
};

const uploadRanking = async (page) => {
  await page.goto('http://localhost:3003/#/upload');
  await page.waitForSelector('#fileDrop');
  const fileEle = await page.$('input[type="file"]');
  await page.waitForSelector('#fileDrop');
  await fileEle.uploadFile('./tests/helpers/TestRatingFile.xls');
  await page.waitForSelector('form');
  await page.type('input[name=rankingName]', 'Puppeteer Competition');
  await page.waitForSelector('button[type=submit]');
  await page.click('button[type=submit]');
};
module.exports = { login, uploadRanking };
