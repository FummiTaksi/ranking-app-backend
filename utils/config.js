if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let PORT = process.env.PORT
let MONGOLAB_URL = process.env.MONGOLAB_URL

if (process.env.NODE_ENV === 'test') {
  PORT = process.env.TEST_PORT
  MONGOLAB_URL = 'mongodb://localhost/testDB'
}

module.exports = {
  PORT,
  MONGOLAB_URL
}