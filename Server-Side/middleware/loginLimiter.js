const rateLimit = require("express-rate-limit");
const { logEvents } = require('./logger');
const { options } = require("../routes/root");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts from this IP, please try again after 1 minute pause'
    },
    handler: (req, res, next, options) => {
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t
        ${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,   //Return rate limit info in the Rate-limiter header
    legacyHeaders: false,    //Disable the X-RateLimiter header
})

module.exports = loginLimiter;