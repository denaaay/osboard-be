const { get } = require('mongoose')
const board = require('../repository/board')
const user = require('../repository/users')

const createBoard = async (req, res) => {
    try {
        const owner = req.userId
        const title = req.body.title
        const description = req.body.description
        const members = req.body.members

        if (title === '') {
            res.status(400).json({
                status_code: 400,
                message: 'title cannot null'
            })
            return
        }

        if (title.length >= 20) {
            res.status(400).json({
                status_code: 400,
                message: 'title cannot more than 20 char'
            })
            return
        }

        if (description.length >= 200) {
            res.status(400).json({
                status_code: 400,
                message: 'description cannot more than 200 char'
            })
            return
        }

        for (const memberId of members) {
            const getUser = await user.findById(memberId, null)

            if (!getUser) {
                res.status(404).json({
                    status_code: 404,
                    message: 'user not found',
                })
                return
            }

            if (memberId == owner) {
                const indexOwner = members.indexOf(memberId)
                members.splice(indexOwner, 1)
            }
        }

        const newBoard = await board.createBoard(title, description, owner, members)
        res.status(201).json({
            status_code: 201,
            message: 'success creating board',
            data: newBoard
        })
        return
    } catch (e) {
        res.status(500).json({
            status_code: 500,
            message: `internal server error : ${e.message}`
        })
        return
    }
}

const getAllBoardByUser = async (req, res) => {
    try {
        const userId = req.userId

        const owner = await board.getAllBoardByOwner(userId, null)
        const member = await board.getAllBoardByMember(userId, null)

        if (owner.length === 0 && member.length === 0) {
            res.status(404).json({
                status_code: 404,
                message: 'board is null'
            })
            return
        }

        const results = []
        if (owner.length > 0) {
            for (const board of owner) {
                const members = []
                for (const memberId of board.members) {
                    const getUser = await user.findById(memberId)
                    members.push(getUser.username)
                }

                const ownerOfBoard = await user.findById(board.owner)

                const res = {
                    id: board._id,
                    title: board.title,
                    description: board.description,
                    owner: ownerOfBoard.username,
                    members: members
                }

                results.push(res)
            }
        } else if (member.length > 0) {
            for (const board of member) {
                const members = []
                for (const memberId of board.members) {
                    const getUser = await user.findById(memberId)
                    members.push(getUser.username)
                }

                const ownerOfBoard = await user.findById(board.owner)

                const res = {
                    id: board._id,
                    title: board.title,
                    description: board.description,
                    owner: ownerOfBoard.username,
                    members: members
                }

                results.push(res)
            }
        }

        res.status(200).json({
            status_code: 200,
            message: 'success getting all board by user',
            data: results
        })
        return
    } catch (e) {
        res.status(500).json({
            status_code: 500,
            message: `internal server error : ${e.message}`
        })
        return
    }
}

const getBoardById = async (req, res) => {
    try {
        const userId = req.userId
        const boardId = req.params.id

        const getBoard = await board.getBoardById(boardId, null)

        if (!getBoard) {
            res.status(404).json({
                status_code: 404,
                message: 'board not found'
            })
            return
        }

        const owner = await user.findById(getBoard.owner)
        const members = []
        const membersId = []
        let valid = false

        for (const memberId of getBoard.members) {
            const member = await user.findById(memberId)
            members.push(member.username)
            membersId.push(member._id)
        }

        if (userId == getBoard.owner) {
            valid = true
        } else {
            for (const memberId of membersId) {
                if (memberId == userId) {
                    valid = true
                }
            }
        }

        if (valid === false) {
            res.status(401).json({
                status_code: 401,
                message: 'you are not the owner or member of this board'
            })
            return
        }

        const result = {
            id: getBoard.id,
            title: getBoard.title,
            description: getBoard.description,
            owner: owner.username,
            members: members,
        }

        res.status(200).json({
            status_code: 200,
            message: 'success getting board by id',
            data: result,
        })
        return
    } catch (e) {
        res.status(500).json({
            status_code: 500,
            message: `internal server error : ${e.message}`
        })
        return
    }
}

const updateBoard = async (req, res) => {
    try {
        const userId = req.userId
        const boardId = req.params.id
        let title = req.body.title
        let description = req.body.description

        const getBoard = await board.getBoardById(boardId, null)

        if (!getBoard) {
            res.status(404).json({
                status_code: 404,
                message: 'board not found'
            })
            return
        }

        if (userId != getBoard.owner) {
            res.status(401).json({
                status_code: 401,
                message: 'you are not the owner of this board'
            })
            return
        }

        if (title === '' && description === '') {
            res.status(404).json({
                status_code: 400,
                message: 'please fill all body requested'
            })
            return
        }

        if (title === '') {
            title = getBoard.title
        } else if (description === '') {
            description = getBoard.description
        }

        const updateData = {
            title: title,
            description: description
        }

        if (title.length >= 20) {
            res.status(400).json({
                status_code: 400,
                message: 'title cannot more than 20 char'
            })
            return
        }

        if (description.length >= 200) {
            res.status(400).json({
                status_code: 400,
                message: 'description cannot more than 200 char'
            })
            return
        }

        await board.updateBoard(boardId, updateData)

        const result = {
            title: title,
            description: description
        }

        res.status(200).json({
            status_code: 200,
            message: 'success updating board',
            data: result
        })
        return
    } catch (e) {
        res.status(500).json({
            status_code: 500,
            message: `internal server error : ${e.message}`
        })
        return
    }
}

const updateBoardMember = async (req, res) => {
    try {
        const userId = req.userId
        const boardId = req.params.id
        const members = req.body.members

        const getBoard = await board.getBoardById(boardId, null)

        if (!getBoard) {
            res.status(404).json({
                status_code: 404,
                message: 'board not found'
            })
            return
        }

        if (userId != getBoard.owner) {
            res.status(401).json({
                status_code: 401,
                message: 'you are not the owner of this board'
            })
            return
        }

        for (const memberId of members) {
            const getUser = await user.findById(memberId, null)

            if (!getUser) {
                res.status(404).json({
                    status_code: 404,
                    message: 'user not found'
                })
                return
            }

            if (memberId == getBoard.owner) {
                const indexOwner = members.indexOf(memberId)
                members.splice(indexOwner, 1)
            } 
        }

        const updateData = {
            members: members
        }

        await board.updateBoard(boardId, updateData)

        const result = {
            members: members
        }

        res.status(200).json({
            status_code: 200,
            message: 'success updating members of board',
            data: result
        })
        return
    } catch (e) {
        res.status(500).json({
            status_code: 500,
            message: `internal server error : ${e.message}`
        })
        return
    }
}

const deleteBoard = async (req, res) => {
    try {
        const userId = req.userId
        const boardId = req.params.id
        const updateData = {
            deletedAt: new Date()
        }

        const getBoard = await board.getBoardById(boardId, null)

        if (!getBoard) {
            res.status(404).json({
                status_code: 404,
                message: 'board not found'
            })
            return
        }

        if (userId != getBoard.owner) {
            res.status(401).json({
                status_code: 401,
                message: 'you are not the owner of this board'
            })
            return
        }

        await board.updateBoard(boardId, updateData)

        res.status(200).json({
            status_code: 200,
            message: `success deleting board : ${getBoard.title}`
        })
        return
    } catch (e) {
        res.status(500).json({
            status_code: 500,
            message: `internal server error : ${e.message}`
        })
        return
    }
}

module.exports = {
    createBoard,
    getAllBoardByUser,
    getBoardById,
    updateBoard,
    updateBoardMember,
    deleteBoard,
}