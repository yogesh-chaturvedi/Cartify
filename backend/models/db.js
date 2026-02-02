const mongoose = require('mongoose')


const connectioString = process.env.MONGODB_URI

// console.log('connectioString', connectioString)
mongoose.connect(connectioString)
    .then(() => {
        console.log("Connected Successfully")
    })
    .catch((error) => {
        console.log("Connection Failed")
        console.error(error)
    })