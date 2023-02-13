const mysql = require('mysql2')

const dotenv = require('dotenv')
const myEnv = dotenv.config()

// Logging
const logger = require('../util/logger')

// Pool connection for optimization.
var pool = mysql.createPool({
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Prepared statement to prevent XSS.
// Need to set DB autocommit to false.
function query(sql, arr, retrieveLastIndex = false) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, conn) {
            if (!conn) {
                logger.log('warn', '[db.js -> query()]', { message: 'Database is not active.' })
                return reject(error)
            }
            if (error) {
                logger.log('error', '[db.js -> query()]', { message: error })
                return reject(error)
            }
            conn.execute(sql, arr, function (error, result, fields) {
                if (error) {
                    reject(error)
                    logger.log('error', '[db.js -> query()]', { message: error })
                    conn.query('ROLLBACK;', function (error, results, fields) {
                        if (error) logger.log('error', '[db.js -> query()]', { message: error })
                    })
                } else {
                    if (!retrieveLastIndex) {
                        resolve(result)
                    } else {
                        resolve(result.insertId)
                    }
                    conn.query('COMMIT;', function (error, results, fields) {
                        if (error) logger.log('error', '[db.js -> query()]', { message: error })
                    })
                }
            })
            pool.releaseConnection(conn)
        })
    })
}

module.exports = {
    query
}