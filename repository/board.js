const board = require('../models/board')

const createBoard = async (title, description, owner, members) => {
    const newBoard = new board({
        title: title,
        description: description,
        owner: owner,
        members: members,
    })

    return await newBoard.save()
}

const getAllBoardByOwner = async (owner, deletedAt = '') => {
    const query = {owner}

    if (deletedAt === null) {
        query.deletedAt = deletedAt
    }

    return await board.find(query)
}

const getAllBoardByMember = async (memberId, deletedAt = '') => {
    const query = {members: {$in: [memberId]}}

    if (deletedAt === null) {
        query.deletedAt = deletedAt
    }

    return await board.find(query)
}

const getBoardById = async (_id, deletedAt = '') => {
    const query = {_id}

    if (deletedAt === null) {
        query.deletedAt = deletedAt
    }

    return await board.findOne(query)
}

const updateBoard = async (_id, updateData) => {
    return await board.updateOne({_id}, updateData)
}

module.exports = {
    createBoard,
    getAllBoardByOwner,
    getAllBoardByMember,
    getBoardById,
    updateBoard
}