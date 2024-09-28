const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    fullname: {
        required: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    username: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    status: {
        enum: ['regular', 'premium'],
        default: 'regular',
        type: String
    },
    role: {
        enum: ['admin', 'user'],
        default: 'user',
        type: String
    },
    deletedAt: {
        default: null,
        type: Date
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)