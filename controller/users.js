const user = require('../repository/users')
const bcrypt = require('bcryptjs');

const getAllUsers = async (_, res) => {
    try {
        const users = await user.getAllUsers(null)
        if (users.length === 0) {
            res.status(404).json({
                status_code: 404,
                message: 'user not found'
            })
            return
        }

        const results = []
        users.map((user) => {
            const res = {
                fullname: user.fullname,
                email: user.email,
                username: user.username,
                status: user.status
            }

            results.push(res)
        })

        res.status(200).json({
            status_code: 200,
            message: 'success getting all users',
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

const getAllUsersByStatus = async (req, res) => {
    try {
        const status = req.params.status
        const users = await user.getAllUsersByStatus(status, null)

        if (users.length === 0) {
            res.status(404).json({
                status_code: 404,
                message: 'user not found'
            })
            return
        }

        const results = []
        users.map((user) => {
            const res = {
                fullname: user.fullname,
                email: user.email,
                username: user.username,
            }

            results.push(res)
        })

        res.status(200).json({
            status_code: 200,
            message: `success getting all ${status} users`,
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

const updateUserFullname = async (req, res) => {
    try {
        const userId = req.userId
        const fullname = req.body.fullname
        const updateData = {
            fullname: fullname
        }
        const getUser = await user.findById(userId, null)

        if (getUser.length === 0) {
            req.status(404).json({
                status_code: 404,
                message: 'user not found'
            })
            return
        }

        if (fullname === '') {
            res.status(400).json({
                status_code: 400,
                message: 'fullname cannot null'
            })
            return
        }

        if (fullname.length < 3) {
            res.status(400).json({
                status_code: 400,
                message: 'fullname cannot less than 3 character'
            })
            return
        }

        if (getUser.fullname === updateData.fullname) {
            res.status(400).json({
                status_code: 400,
                message: 'fullname cannot be the same'
            })
            return
        }

        await user.updateUser(userId, updateData)

        const result = {
            old_fullname: getUser.fullname,
            new_fullname: fullname
        }

        res.status(200).json({
            status_code: 200,
            message: 'success updating user fullname',
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

const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id
        const status = req.body.status
        const updateData = {
            status: status
        }
        const getUser = await user.findById(userId, null)

        if (getUser.length === 0) {
            res.status(404).json({
                status_code: 404,
                message: 'user not found'
            })
            return
        }

        if (status === '') {
            res.status(400).json({
                status_code: 400,
                message: 'status cannot null'
            })
            return
        }

        if (status !== 'regular' && status !== 'premium') {
            res.status(400).json({
                status_code: 400,
                message: 'invalid status'
            })
            return
        }

        if (status === getUser.status) {
            res.status(400).json({
                status_code: 400,
                message: 'status cannot be the same'
            })
            return
        }

        await user.updateUser(userId, updateData)

        const result = {
            old_status: getUser.status,
            new_status: status
        }

        res.status(200).json({
            status_code: 200,
            message: 'success updating user status',
            data: result
        })

    } catch (e) {
        res.status(500).json({
            status_code: 500,
            message: `internal server error : ${e.message}`
        })
        return
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.userId
        const old_password = req.body.old_password
        const new_password = req.body.new_password
        const confirm_password = req.body.confirm_password
        const getUser = await user.findById(userId, null)

        if (getUser.length === 0) {
            res.status(404).json({
                status_code: 404,
                message: 'user not found'
            })
            return
        }

        if (old_password === '') {
            res.status(400).json({
                status_code: 400,
                message: 'old password cannot null'
            })
            return
        }

        const isMatch = await bcrypt.compare(old_password, getUser.password);
        if (!isMatch) {
            res.status(400).json({
                status_code: 400,
                message: 'old password is incorrect'
            })
            return
        }

        if (new_password === '' || confirm_password === '') {
            res.status(400).json({
                status_code: 400,
                message: 'new and confirm password cannot null'
            })
            return
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
        const validatePassword = passwordRegex.test(new_password)

        if (new_password.length < 6) {
            res.status(400).json({
                status_code: 400,
                message: 'password cannot less than 6 character'
            })
            return
        }

        if (!validatePassword) {
            res.status(400).json({
                status_code: 400,
                message: 'password must contain at least one uppercase letter, one lowercase letter, and a number.'
            })
            return
        }

        if (new_password !== confirm_password) {
            res.status(400).json({
                status_code: 400,
                message: 'new and confirm password is not match'
            })
            return
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        const updateData = {
            password: hashedPassword
        }

        await user.updateUser(userId, updateData)

        res.status(200).json({
            status_code: 200,
            message: 'success updating password'
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

const deleteUser = async (req, res) => {
    try {
        const userId = req.userId
        const getUser = await user.findById(userId, null)

        if (getUser.length === 0) {
            res.status(404).json({
                status_code: 404,
                message: 'user not found'
            })
            return
        }

        await user.deleteUser(userId)
        
        res.status(200).json({
            status_code: 200,
            message: 'success deleting user'
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

const deleteByAdmin = async (req, res) => {
    try {
        const userId = req.params.id
        const updateData = {
            deletedAt: new Date()
        }
        const getUser = await user.findById(userId, null)

        if (getUser.length === 0) {
            res.status(404).json({
                status_code: 404,
                message: 'user not found'
            })
            return
        }

        await user.updateUser(userId, updateData)
        
        res.status(200).json({
            status_code: 200,
            message: `success soft deleting user with username : ${getUser.username}`
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

const recoverUser = async (req, res) => {
    try {
        const userId = req.params.id
        const updateData = {
            deletedAt: null
        }

        const getUser = await user.findById(userId)

        if (getUser.length === 0) {
            res.status(404).json({
                status_code: 404,
                message: 'user not found'
            })
            return
        }

        await user.updateUser(userId, updateData)

        res.status(200).json({
            status_code: 200,
            message: 'success recovery user'
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
    getAllUsers,
    getAllUsersByStatus,
    updateUserFullname,
    updateUserStatus,
    changePassword,
    deleteUser,
    deleteByAdmin,
    recoverUser,
}