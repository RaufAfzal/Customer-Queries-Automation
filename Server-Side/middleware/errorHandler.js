const { logEvents } = require('./logger');

const errorHandler = async (err, req, res, next) => {
    // Log error details to a log file
    await logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.headers.origin}\t${err.stack}`, 'errLog.log');

    // Set the status code, default to 500 if not already set
    const status = res.statusCode ? res.statusCode : 500;

    res.status(status).json({
        message: err.message
    });
};

module.exports = errorHandler;
