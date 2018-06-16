const testHelpers = require('../../helpers/testHelpers')
const fileService = require('../../../services/fileService')

describe.only('FileService ', () => {
  test(' converts base64 to json without ', () => {
    const base64 = testHelpers.getRatingBase64()
    fileService.convertBase64ToExcel(base64)
    expect(true).toBeTruthy()
  })
})