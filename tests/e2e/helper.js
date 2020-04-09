const login = async (page, username, password) => {
  await page.type('input', username);
  await page.type('input[type=password]', password);
  await page.click('button');
};
const timeout = 200000;

const uploadRanking = async (page, filePath, rankingName, rankingDate) => {
  await page.goto('http://localhost:3003/#/upload');
  await page.waitForSelector('.success', { hidden: true }, timeout);
  await page.waitForSelector('#fileDrop');
  const fileEle = await page.$('input[type="file"]');
  await fileEle.uploadFile(filePath);
  await page.waitForSelector('form');
  await page.type('input[name=rankingName]', rankingName);
  await page.type('input[name=rankingDate]', rankingDate);
  await page.waitForSelector('button[type=submit]');
  await page.click('button[type=submit]');
  await page.waitForSelector('.success', timeout);
};
const uploadSpringRanking = async (page) => {
  await uploadRanking(page, './tests/helpers/rating-files/spring/TestRatingFile.xls',
    'Puppeteer Competition', '06.06.2018');
};

const uploadFallRanking = async (page) => {
  await uploadRanking(page, './tests/helpers/rating-files/fall/TestRatingFileFall.xls',
    'Fall Competition', '07.07.2018');
};

module.exports = {
  login, uploadSpringRanking, uploadFallRanking, timeout,
};
