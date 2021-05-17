const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendenceSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    entry: { type: Date },
    exit: {
        time: {
            type: Date
        }

    },
    status: {
        type: String
    }
})

module.exports = mongoose.model('Attendence', attendenceSchema)