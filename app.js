const config = require('./utils/config')
const express = require("express")
require('express-async-errors')
const app = express()
const cors = require('cors')
const usersRouter = require('./controller/users')
//const cardRouter = require('./controller/cards')
const loginRouter = require('./controller/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require("mongoose")

logger.info('connecting to', config.MONGODB_URI) // comment out later

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to database')
    })
    .catch((error) => {
        logger.error('error connecting to database: ', error.message)
    })

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor) 

app.use('/cards', middleware.userExtractor, cardRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app



