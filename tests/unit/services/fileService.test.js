const testHelpers = require('../../helpers/testHelpers')
const fileService = require('../../../services/fileService')

describe.only('FileService ', () => {
  test(' converts base64 to json without ', () => {
    const base64 = testHelpers.getRatingBase64()
    const fileJson = fileService.convertBase64ToExcel(base64)
    expect(fileJson.length).toEqual(11)
  })
})