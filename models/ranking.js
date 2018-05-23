const mongoose = require('mongoose')

const rankingSchema = new mongoose.Schema({
  nameOfCompetition: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

const Ranking = mongoose.model('Ranking', {
  nameOfCompetition: String,
  date: Date,
  positions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }]
},rankingSchema)



module.exports = Ranking