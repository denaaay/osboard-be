const express = require('express')
const router = express.Router()

const users = require('./controller/users')
const auth = require('./controller/auth')
const middleware = require('./controller/middleware')

// landing route
router.get('/', (req, res) => {
    res.send('hallo dunyaa')
})

// auth
router.post('/register', auth.register)
router.post('/login', auth.login)
router.post('/logout', middleware.checkAuth, auth.logout)
router.get('/test', middleware.checkPremium, (req, res) => {
    res.send('success')
})

module.exports = router