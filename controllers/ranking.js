const jwt = require('jsonwebtoken')
const rankingRouter= require('express').Router()
const User = require('../models/user')
const fileService = require('../services/fileService')
const rankingService = require('../services/rankingService')

rankingRouter.get('/', async (request, response) => {
  try {
    const rankings = await rankingService.getRankings()
    console.log('allRankings', rankings)
    response.status(200).send({ rankings })
  }
  catch(error) {
    console.log('ERROR WHEN GETTING RANKINGS', error)
    response.status(400).json({ message: 'Error while retrieving rankings' })
  }
})

rankingRouter.post('/new', async (request, response) => {
  try {
    const token = request.token
    const body = request.body
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json(getAccessDeniedMessage())
    }
    const userWhoAddedRanking = await User.findById(decodedToken.id)
    if (!userWhoAddedRanking.admin) {
      return response.status(401).json(getAccessDeniedMessage())
    }
    if (!body.rankingName) {
      return response.status(400).json({ error: 'Ranking must have a name!' })
    }
    if (!body.rankingDate) {
      return response.status(400).json({ error: 'Ranking must have a date!' })
    }
    const json = fileService.convertBase64ToExcel(body.rankingFileBase64)
    const ranking = await rankingService.saveRankingToDatabase(json, body)
    return response.status(200).json({ message: 'Ranking was created successfully' , ranking: ranking })
  }
  catch(error) {
    console.log('ERROR', error)
    return response.status(400).json(getAccessDeniedMessage())
  }
})

rankingRouter.delete('/:id', async (request, response) => {
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('decodedToken', decodedToken)
    if (!token || !decodedToken.id) {
      return response.status(401).json(getAccessDeniedMessage())
    }
    const userWhoAddedRanking = await User.findById(decodedToken.id)
    if (!userWhoAddedRanking.admin) {
      return response.status(401).json(getAccessDeniedMessage())
    }
    const deletedRanking = await rankingService.deleteRanking(request.params.id)
    return response.status(200).json({ message: 'Ranking was deleted successfully', deletedRanking })
  }
  catch(error) {
    console.log('error while deleting ranking',error)
    response.status(400).json(getAccessDeniedMessage())
  }

})

const getAccessDeniedMessage = () => {
  return ({ error: 'You must be signed in admin to create new ranking!' })
}

module.exports = rankingRouter