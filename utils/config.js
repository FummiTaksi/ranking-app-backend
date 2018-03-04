if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

let PORT = process.env.PORT
let MONGOLAB_URL = process.env.MONGOLAB_URL

module.exports = {
    PORT,
    MONGOLAB_URL
}