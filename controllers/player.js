const playerRouter = require('express').Router();
const playerService = require('../services/playerService');

playerRouter.get('/', async (request, response) => {
  try {
    const players = await playerService.getPlayers();
    response.status(200).send({ players });
  } catch (error) {
    console.log('ERROR WHEN GETTING PLAYERS', error);
    response.status(400).json({ message: 'Error while retrieving players' });
  }
});

playerRouter.get('/:id', async (request, response) => {
  try {
    const player = await playerService.getPlayer(request.params.id);
    response.status(200).send({ player });
  } catch (error) {
    console.log('ERROR WHEN GETTING PLAYERS', error);
    response.status(400).json({ message: 'Error when fetching player' });
  }
});
module.exports = playerRouter;
