const express = require('express')
const router = express.Router()

// landing route
router.get('/', (req, res) => {
    res.send('hallo dunyaa')
})

module.exports = router