//CODE HAS BEEN COPIED NOT WRITTEN THIS STILL NEEDS TO BE WRITTEN FOR THIS APPLICATION
const express = require('express');
const cors = require('cors')

const logger = require('./logger')
const forcastRouter = require('./router/forcastRoutes')
const userRouter = require('./router/userRoutes')


const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(logger)

// Routing
app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use('/forcasts', forcastRouter)
app.use('/user', userRouter)

module.exports = app