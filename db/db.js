const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    }
})

const Idendity = new mongoose.model('Idendity', dataSchema)


module.exports = Idendity