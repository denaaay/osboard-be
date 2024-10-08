require('dotenv').config()
const user = require('../repository/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const fullname = req.body.fullname
        const email = req.body.email
        const username = req.body.username
        const password = req.body.password

        const getUserEmail = await user.findByEmail(email)
        const getUserUsername = await user.findByUsername(username)

        if (getUserEmail) {
            res.status(400).json({
                status_code: 400,
                message: 'email already used'
            })
            return
        }

        if (getUserUsername) {
            res.status(400).json({
                status_code: 400,
                message: 'username already used'
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

        if (email === '') {
            res.status(400).json({
                status_code: 400,
                message: 'email cannot null'
            })
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const validateEmail = emailRegex.test(email)

        if (!validateEmail) {
            res.status(400).json({
                status_code: 400,
                message: 'please input the correct email format'
            })
            return
        }

        if (username === '') {
            res.status(400).json({
                status_code: 400,
                message: 'username cannot null'
            })
            return
        }

        if (password === '') {
            res.status(400).json({
                status_code: 400,
                message: 'password cannot null'
            })
            return
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
        const validatePassword = passwordRegex.test(password)

        if (password.length < 6) {
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

        if (fullname.length < 3) {
            res.status(400).json({
                status_code: 400,
                message: 'fullname cannot less than 3 character'
            })
            return
        }

        if (username.length < 5 || username.length >= 20) {
            res.status(400).json({
                status_code: 400,
                message: 'username cannot less than 5 or more than 20 character'
            })
            return
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await user.saveUser(fullname, email, username, hashedPassword)
        res.status(201).json({
            status_code: 201,
            message: 'success creating user',
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

const login = async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const findUser = await user.findByUsername(username, null)

        if (!findUser) {
            res.status(404).json({
                status_code: 404,
                message: 'user not found',
            })
            return
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            res.status(400).json({
                status_code: 400,
                message: 'incorrect password'
            })
            return
        }

        req.session.userId = findUser.id
        const payload = {
            id: findUser.id,
        }

        const secretKey = process.env.SESSION_KEY
        const jwtToken = jwt.sign(payload, secretKey, { expiresIn: '24h' })

        res.status(200).json({
            status_code: 200,
            message: 'login success',
            username: username,
            token: jwtToken
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

const logout = async (req, res) => {
    req.session.destroy((e) => {
        if (e) {
            res.status(500).json({
                status_code: 500,
                message: `internal server error : ${e.message}`
            })
            return
        } else {
            res.status(200).json({
                status_code: 200,
                message: 'logout success'
            })
            return
        }
    })
}

module.exports = {
    register,
    login,
    logout,
}