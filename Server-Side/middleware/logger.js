const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const path = require('path')
const fspromises = require('fs').promises


const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t\n${uuid()}\t\n${message}`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fs.promises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fspromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    }
    catch (err) {
        console.log(err)
    }

}

const logger = async (req, res, next) => {
    await logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    next()
}

module.exports = { logEvents, logger }