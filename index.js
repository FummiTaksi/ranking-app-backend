const express = require('express')
const app = express()
const config = require('./utils/config')
const mongoose = require('mongoose')
const http = require('http')

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

mongoose.connect(config.MONGOLAB_URL)
mongoose.Promise = global.Promise

const PORT = config.PORT

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app,server
}