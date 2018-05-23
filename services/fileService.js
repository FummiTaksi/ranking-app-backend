const xlsx = require('xlsx')

const convertBase64ToExcel = (base64String) => {
  console.log('convert base64:sta exceliin...')
  const withoutPrefix = base64String.substring(37)
  const options = { type: 'base64' }
  const xlsFromBase64 = xlsx.read(withoutPrefix, options)
  console.log('WORKBOOK ', xlsFromBase64)
}

module.exports = { convertBase64ToExcel }