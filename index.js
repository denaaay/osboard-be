// setting up dependencies
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const routes = require('./routes')

const app = express()
const mongoStr = process.env.DATABASE_URI

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

// setting up session
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

// express using library
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use('/api', routes)

// listen to server
app.listen(process.env.PORT, () => {
    console.log(`server run on port ${process.env.PORT}`)
})