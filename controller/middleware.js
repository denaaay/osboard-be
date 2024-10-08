require('dotenv').config()
const jwt = require('jsonwebtoken')
const user = require('../repository/users')

const checkAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, process.env.SESSION_KEY, (err, decode) => {
            if (err) {
                res.status(403).json({
                    status_code: 403,
                    message: 'Token Tidak Valid, Silahkan Login Ulang'
                })
                return
            } else {
                req.user = decode
                req.userId = decode.id
                next()
            }
        })
    } else {
        res.status(401).json({
            status_code: 401,
            message: 'Token tidak ditemukan dalam header Authorization.'
        })
        return
    }
}

const checkAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, process.env.SESSION_KEY, async (err, decode) => {
            if (err) {
                res.status(403).json({
                    status_code: 403,
                    message: 'Token Tidak Valid, Silahkan Login Ulang'
                })
                return
            } else {
                req.user = decode

                try {
                    const findUser = await user.findById(req.user.id)

                    if (!findUser) {
                        res.status(404).json({
                            status_code: 404,
                            message: 'user not found',
                        })
                        return
                    }

                    if (findUser.role !== 'admin') {
                        res.status(403).json({
                            status_code: 403,
                            message: 'forbidden, you are not an admin',
                        })
                        return
                    }

                    next()
                } catch (e) {
                    res.status(500).json({
                        status_code: 500,
                        message: `internal server error : ${e.message}`
                    })
                    return
                }
            }
        })
    } else {
        res.status(401).json({
            status_code: 401,
            message: 'Token tidak ditemukan dalam header Authorization.'
        })
        return
    }
}

const checkPremium = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, process.env.SESSION_KEY, async (err, decode) => {
            if (err) {
                res.status(403).json({
                    status_code: 403,
                    message: 'Token Tidak Valid, Silahkan Login Ulang'
                })
                return
            } else {
                req.user = decode

                try {
                    const findUser = await user.findById(req.user.id)

                    if (!findUser) {
                        res.status(404).json({
                            status_code: 404,
                            message: 'user not found',
                        })
                        return
                    }

                    if (findUser.status !== 'premium') {
                        res.status(403).json({
                            status_code: 403,
                            message: 'forbidden, you are not a premium user',
                        })
                        return
                    }

                    next()
                } catch (e) {
                    res.status(500).json({
                        status_code: 500,
                        message: `internal server error : ${e.message}`
                    })
                    return
                }
            }
        })
    } else {
        res.status(401).json({
            status_code: 401,
            message: 'Token tidak ditemukan dalam header Authorization.'
        })
        return
    }
}

module.exports = {
    checkAuth,
    checkAdmin,
    checkPremium,
}