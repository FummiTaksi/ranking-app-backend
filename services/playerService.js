const Player = require('../models/player');

const createPlayer = async (positionSaveResponse) => {
  const { playerName } = positionSaveResponse;
  const player = await Player.findOne({ name: playerName });
  if (player) {
    player.positions = player.positions.concat(positionSaveResponse);
    const updateResponse = await Player.findByIdAndUpdate(player._id, player);
    return updateResponse;
  }
  const playerModel = new Player({ name: positionSaveResponse.playerName });
  playerModel.positions = [positionSaveResponse];
  const response = await playerModel.save();
  return response;
};

module.exports = { createPlayer };
