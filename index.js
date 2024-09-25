// setting up dependencies
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const routes = require('./routes')

const app = express()
const mongoStr = process.env.DATABASE_URL

// make db connection
mongoose.connect(mongoStr)
const db = mongoose.connection

// testing db connection
db.on('error', (e) => {
    console.error(e)
})

db.once('connected', () => {
    console.log('database connected')
})

// express using library
app.use(bodyParser.json())
app.use('/api', routes)

// listen to server
app.listen(process.env.PORT, () => {
    console.log(`server run on port ${process.env.PORT}`)
})