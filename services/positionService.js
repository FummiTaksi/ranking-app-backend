const Position = require('../models/position');

const createPosition = async (positionBody) => {
  const positionModel = new Position(positionBody);
  const response = await positionModel.save();
  return response;
};

const getPositions = async () => {
  const positions = await Position.find({}).populate('ranking', {
    competitionName: 1,
  });
  return positions;
};

module.exports = { createPosition, getPositions };
