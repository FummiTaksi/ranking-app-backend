const mongoose = require('mongoose')

const Position = mongoose.model('Position', {
  position: Number,
  rating: Number,
  playerName: String,
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Ranking' }
}, positionSchema)

const positionSchema = new mongoose.Schema({
  position: {
    type: Number,
    required: true,
    min: [1, 'Must be greater or equal to 1']
  },
  rating: {
    type: Number,
    required: true,
    min: [0, 'Must be positive']
  },
  playerName: {
    type: String,
    required: true
  }

})

module.exports = Position