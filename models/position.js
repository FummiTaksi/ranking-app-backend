const mongoose = require('mongoose')

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
  },
  clubName: {
    type: String
  },
  ranking: { type: mongoose.Schema.Types.ObjectId, ref: 'Ranking' },
})

const Position = mongoose.model('Position', positionSchema)

module.exports = Position