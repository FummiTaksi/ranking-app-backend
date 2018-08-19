if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

let { PORT, MONGOLAB_URL } = process.env;

if (process.env.NODE_ENV === 'test') {
  PORT = process.env.TEST_PORT;
  MONGOLAB_URL = 'mongodb://localhost/testDB';
}

module.exports = {
  PORT,
  MONGOLAB_URL,
};
