require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3500
const { logger } = require('./middleware/logger.js')
const errorHandler = require('./middleware/errorHandler.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptionsDelegate = require('./config/corsOptions.js')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

app.use(logger)

connectDB();

app.use(cors(corsOptionsDelegate))

app.use(express.json())

app.use(cookieParser())


app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.use('/users', require('./routes/userRoutes'))

app.use('/notes', require('./routes/noteRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')) {
        res.json({ message: '404 not found' })
    }
    else {
        res.type('txt').send('404 not found')
    }
})

app.use(errorHandler)

mongoose.connection.on('open', () => {
    console.log('Connected to Db')
    app.listen(port, () => console.log(`server running on ${port}`))
});