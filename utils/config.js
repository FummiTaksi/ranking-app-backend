if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    console.log("EN OLE TUOTANNOSS!")
}

let PORT = process.env.PORT

module.exports = {
    PORT
}