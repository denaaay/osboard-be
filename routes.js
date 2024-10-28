const express = require('express')
const router = express.Router()

const users = require('./controller/users')
const board = require('./controller/board')
const auth = require('./controller/auth')
const middleware = require('./controller/middleware')

// landing route
router.get('/', (req, res) => {
    res.send('hallo dunyaa')
})

// auth
router.post('/register', auth.register) // users
router.post('/login', auth.login) // users
router.post('/logout', middleware.checkAuth, auth.logout) // users
// router.get('/test', middleware.checkPremium, (req, res) => {
//     res.send('success')
// })

// users
router.get('/users', middleware.checkAdmin, users.getAllUsers) // admin
router.get('/users/:status', middleware.checkAdmin, users.getAllUsersByStatus) // admin
router.post('/updateUser', middleware.checkAuth, users.updateUserFullname) // users
router.post('/updateUser/:id', middleware.checkAdmin, users.updateUserStatus) // admin
router.post('/changePassword', middleware.checkAuth, users.changePassword) // users
router.delete('/deleteUser', middleware.checkAuth, users.deleteUser) // users
router.delete('/softDeleteUser/:id', middleware.checkAdmin, users.deleteByAdmin) // admin
router.post('/recoverUser/:id', middleware.checkAdmin, users.recoverUser) // admin

// board
router.post('/createBoard', middleware.checkAuth, board.createBoard) // users
router.get('/board', middleware.checkAuth, board.getAllBoardByUser) // users
router.get('/board/:id', middleware.checkAuth, board.getBoardById) // users
router.post('/updateBoard/:id', middleware.checkAuth, board.updateBoard) // users
router.post('/updateMemberBoard/:id', middleware.checkAuth, board.updateBoardMember) // user
router.delete('/deleteBoard/:id', middleware.checkAuth, board.deleteBoard) // user

module.exports = router