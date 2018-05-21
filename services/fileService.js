const convertBlobToBase64 = (blob) => {
  const buffer = new Buffer( blob.preview )
  const bufferBase64 = buffer.toString('base64')
  console.log('base64', bufferBase64)
}

module.exports = { convertBlobToBase64 }