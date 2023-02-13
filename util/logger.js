const winston = require('winston')
const dotenv = require('dotenv')

const myEnv = dotenv.config()

const logger = winston.createLogger({
    level: 'info',
    format:
        winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json()
        ),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'PROD') {
    logger.add(new winston.transports.Console({
        'prettyPrint': true,
        'format': winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        )
    }))
}

module.exports = logger