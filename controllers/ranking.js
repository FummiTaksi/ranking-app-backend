const jwt = require('jsonwebtoken')
const rankingRouter= require('express').Router()
const User = require('../models/user')
const fileService = require('../services/fileService')

rankingRouter.post('/new', async (request, response) => {
  try {
    const token = request.token
    const body = request.body
    console.log('BODY',body.rankingName)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json(getAccessDeniedMessage())
    }
    const userWhoAddedRanking = await User.findById(decodedToken.id)
    if (!userWhoAddedRanking.admin) {
      return response.status(401).json(getAccessDeniedMessage())
    }
    fileService.convertBase64ToExcel(body.rankingFileBase64)
    return response.status(200).json({ message: 'All is good' })
  }
  catch(error) {
    console.log('ERROR', error)
    return response.status(400).json(getAccessDeniedMessage())
  }
})

const getAccessDeniedMessage = () => {
  return ({ error: 'You must be signed in admin to create new ranking!' })
}

module.exports = rankingRouter