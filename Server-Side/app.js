require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3500;
const { logger } = require('./middleware/logger.js');
const errorHandler = require('./middleware/errorHandler.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptionsDelegate = require('./config/corsOptions.js');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn.js');

connectDB();

// Middleware setup
app.use(logger);
app.use(cors(corsOptionsDelegate));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your API routes - **these should come before the static files**
app.use('/auth', require('./routes/authRoutes.js'));
app.use('/users', require('./routes/userRoutes.js'));
app.use('/notes', require('./routes/noteRoutes.js'));

// Serve the React app - this should come **after all other routes**
app.use(express.static(path.join(__dirname, "../client-side/build")));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/root.js'));

// Handle 404 for all unknown routes
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '../client-side/build', 'index.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 not found' });
    } else {
        res.type('txt').send('404 not found');
    }
});

// Error handler middleware
app.use(errorHandler);

// Start the server
mongoose.connection.on('open', () => {
    console.log('Connected to DB');
    app.listen(port, () => console.log(`Server running on ${port}`));
});
