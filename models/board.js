const mongoose = require('mongoose')
const users = require('./users')
const boardSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    }],
    deletedAt: {
        default: null,
        type: Date
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Board', boardSchema)