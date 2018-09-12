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
  await fileEle.uploadFile('./tests/helpers/rating-files/spring/TestRatingFile.xls');
  await page.waitForSelector('form');
  await page.type('input[name=rankingName]', 'Puppeteer Competition');
  await page.type('input[name=rankingDate]', '06.06.2018');
  await page.waitForSelector('button[type=submit]');
  await page.click('button[type=submit]');
};

const uploadFallRanking = async (page) => {
  await page.goto('http://localhost:3003/#/upload');
  await page.waitForSelector('#fileDrop');
  const fileEle = await page.$('input[type="file"]');
  await page.waitForSelector('#fileDrop');
  await fileEle.uploadFile('./tests/helpers/rating-files/fall/TestRatingFileFall.xls');
  await page.waitForSelector('form');
  await page.type('input[name=rankingName]', 'Fall Competition');
  await page.type('input[name=rankingDate]', '07.07.2018');
  await page.waitForSelector('button[type=submit]');
  await page.click('button[type=submit]');
};

const timeout = 200000;
module.exports = {
  login, uploadRanking, uploadFallRanking, timeout,
};
