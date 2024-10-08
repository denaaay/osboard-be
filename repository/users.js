const user = require('../models/users')

const saveUser = async (fullname, email, username, password) => {
    const newUser = new user({
        fullname: fullname,
        email: email,
        username: username,
        password: password
    })

    const result = await newUser.save()
    return result
}

const findById = async (_id, deletedAt = '') => {
    if (deletedAt === null) {
        const result = await user.findOne({ _id, deletedAt })
        return result
    } else {
        const result = await user.findOne({ _id })
        return result
    }
}

const findByUsername = async (username, deletedAt = '') => {
    if (deletedAt === null) {
        const result = await user.findOne({ username, deletedAt })
        return result
    } else {
        const result = await user.findOne({ username })
        return result
    }
}

const findByEmail = async (email, deletedAt = '') => {
    if (deletedAt === null) {
        const result = await user.findOne({ email, deletedAt })
        return result
    } else {
        const result = await user.findOne({ email })
        return result
    }
}

const getAllUsers = async (deletedAt = '') => {
    if (deletedAt === null) {
        const result = await user.find({ role: 'user', deletedAt })
        return result
    } else {
        const result = await user.find({ role: 'user' })
        return result
    }
}

const getAllUsersByStatus = async (status, deletedAt = '') => {
    if (deletedAt === null) {
        const result = await user.find({ status, role: 'user', deletedAt })
        return result
    } else {
        const result = await user.find({ status, role: 'user' })
        return result
    }
}

const updateUser = async (_id, updateData) => {
    const result = await user.updateOne({_id}, updateData)
    return result
}

const deleteUser = async (_id) => {
    const result = await user.deleteOne({_id})
    return result
}

module.exports = {
    saveUser,
    findById,
    findByUsername,
    findByEmail,
    getAllUsers,
    getAllUsersByStatus,
    updateUser,
    deleteUser,
}