const Router = require('koa-router')
const router = new Router()

// Environment Configs
const dotenv = require('dotenv')

const myEnv = dotenv.config()

// Rate Limiting
const limiter = require('./limiter')

// Database
const db = require('../db/db.js')

// HTTP response codes
const httpCodes = require('../httpCodes.json')

// For live server/POSTMAN API testing
const getRequest = ctx => {
    if (process.env.RUNTIME_ENV == "PROD") {
        return ctx.req
    } else {
        return ctx.request
    }
}

// Generate short url link.
router.post('/generate', limiter.generateLink, async ctx => {

})

// Convert short url back to original url.
router.get('/:link', async ctx => {

})


module.exports = router