const mongoose = require('mongoose')

const rankingSchema = new mongoose.Schema({
  competitionName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  positions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }]
})

const Ranking = mongoose.model('Ranking', rankingSchema)

module.exports = Ranking