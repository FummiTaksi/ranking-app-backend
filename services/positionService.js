const Position = require('../models/position');

const createPosition = async (positionBody) => {
  const positionModel = new Position(positionBody);
  const response = await positionModel.save();
  return response;
};

module.exports = { createPosition };
