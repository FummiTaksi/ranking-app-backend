const express = require('express')
const app = express()
const config = require('./utils/config')
const mongoose = require('mongoose')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const seeder = require('./db/seeds')

const loginRouter = require('./controllers/login')
const rankingRouter = require('./controllers/ranking')

const middlewares = require('./middlewares/middlewares')

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middlewares.tokenExtractor)
app.use(morgan('tiny'))
app.use('/api/login', loginRouter)
app.use('/api/ranking', rankingRouter)
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
console.log('CONNECTING to ',config.MONGOLAB_URL)
mongoose.connect(config.MONGOLAB_URL)
mongoose.Promise = global.Promise


// Data array containing seed data - documents organized by Model
if (process.env.NODE_ENV !== 'test') {
  seeder.seedAdminToDataBase()
  console.log('DATABASE SEEDED')
}

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