const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    eid: {
        type: Number,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        required: true


    },
    contactNumber: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    attendance: [{
        date: {
            type: Date,
            default: Date.now(),
        },
        entry: {
            type: Date

        },
        exit: {
            time: {
                type: Date

            }

        },
        onleave: {
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: "Pending"
        },
        totaltime: {
            type: Date,
            default: 0
        }


    }],
    isPresent: {
        type: Number, // Number type
        default: 100,
    }



});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);