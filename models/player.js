const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  positions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }],
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
