const fs = require('fs')
const xlsx = require('xlsx')

const convertBase64ToExcel = (base64String) => {
  console.log('convert base64:sta exceliin...')
  /* const buffer = Buffer.from(base64String, 'base64')
  const xlsFromBuffer = xlsx.read(buffer, { type: 'buffer' })
  console.log('FROM BUFFER ',convertBase64ToString(xlsFromBuffer.Sheets.Sheet1.A1.v))*/
  const options = { type: 'base64' }
  //const xlsFromBase64 = xlsx.read(base64String, options)
  const xlsFromBase64 = xlsx.read(base64String, options)
  //console.log('mit vit' , xlsFromBase64.Sheets.Sheet1.A1.v)
  const json = xlsx.utils.sheet_to_json(xlsFromBase64.Sheets.Sheet1)
  //console.log('Sheets',xlsFromBase64.Sheets.Sheet1)
  console.log('FROM BASE64 ', json[0])
}

const convertBase64ToString = (base64) => {
  const textBuffer = new Buffer(base64, 'base64')
  return textBuffer.toString()
}

module.exports = { convertBase64ToExcel }