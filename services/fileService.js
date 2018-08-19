const xlsx = require('xlsx');

const convertBase64ToExcel = (base64String) => {
  const withoutPrefix = base64String.substring(37);
  const options = { type: 'base64' };
  const xlsFromBase64 = xlsx.read(withoutPrefix, options);
  return xlsx.utils.sheet_to_json(xlsFromBase64.Sheets['Rating järjestys']);
};

module.exports = { convertBase64ToExcel };
