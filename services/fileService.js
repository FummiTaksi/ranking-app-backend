const fs = require('fs')
const xlsx = require('xlsx')
//const FileReader = require('filereader')


const convertBase64ToExcel = (base64String) => {
  console.log('convert base64:sta exceliin...')
  const buffer = Buffer.from(base64String, 'base64')
  const xls = xlsx.read(buffer)
  //console.log('xls.Sheets',xls.Sheets)
}

module.exports = { convertBase64ToExcel }