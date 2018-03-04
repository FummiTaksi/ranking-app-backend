const express = require('express')
const app = express()
const config = require('./utils/config')

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

const PORT = config.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})