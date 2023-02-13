const Router = require('koa-router')
const router = new Router()

// Environment Configs
require('dotenv').config()

// Rate Limiting
const limiter = require('./limiter')

// Database
const db = require('../db/db.js')

// Input sanitization
const validator = require('validator')

// HTTP response codes
const httpCodes = require('../httpCodes.json')

// For live server/POSTMAN API testing
const getRequest = ctx => {
    if (process.env.RUNTIME_ENV == 'PROD') {
        return ctx.req
    } else {
        return ctx.request
    }
}

// Generate short url link.
router.post('/generate', limiter.generateLink, async ctx => {

    // Get POST request body.
    const post = getRequest(ctx).body
    let url = post.url
    let expires_on = post.expires_on === undefined ? null : post.expires_on

    // Validate contents.
    if (!url) {
        ctx.response.status = httpCodes['Bad Request']
        ctx.body = { msg: 'Bad Request' }
        return
    }

    // Replace escaped '//' to verify that it is a URL.
    url = url.replace(new RegExp('&#x2F;', 'g'), '/')

    // Validate if user input is a valid URL.
    if (!validator.isURL(url)) {
        ctx.response.status = httpCodes['Bad Request']
        ctx.body = { msg: 'Bad Request' }
        return
    }

    // Base62 encoding with a-z A-Z 0-9 characters.
    let base64_string = process.env.BASE_64
    let random_counter = Math.floor(Date.now() + Math.random())
    let base64_encoding = ''

    // Get a shortlink of specified length.
    while (base64_encoding.length < process.env.SHORT_LINK_LENGTH) {
        base64_encoding += base64_string[random_counter % 62]
        random_counter = Math.floor(random_counter / 62)
    }

    // Insert into database.
    await db.query('INSERT INTO `links` (`short_url`, `source_url`, `expires_on`) VALUES (?, ?, ?);', [base64_encoding, url, expires_on])
        .then(() => {
            ctx.response.status = httpCodes['OK']
            ctx.body = { data: base64_encoding }
        },
            (err) => {
                // Duplicate short link generated (unlikely)
                if (err.errno == 1062) {
                    ctx.response.status = httpCodes['Internal Server Error']
                    ctx.body = { msg: 'Please try again later.' }
                } else {
                    ctx.response.status = httpCodes['Internal Server Error']
                    ctx.body = { msg: 'Internal Server Error.' }
                }
            })
})

// Convert short url back to original url.
router.get('/:link', async ctx => {

    // Escape link to prevent malicious input.
    let link = validator.escape(ctx.params.link)

    // Validate contents.
    if (!link) {
        ctx.response.status = httpCodes['Bad Request']
        ctx.body = { msg: 'Bad Request' }
        return
    }

    // Search for original url.
    await db.query('SELECT `source_url`, `expires_on` FROM `links` WHERE `short_url` = ?;', [link])
        .then((result) => {
            if (result.length > 0) {
                let expires_on = result[0].expires_on
                // Check expiry if it is available.
                if (expires_on != null) {

                    let current_date = new Date()
                    let expiry_date = new Date(expires_on)

                    // Hardcode GMT+8
                    current_date = new Date(current_date.getTime() + (8 * 60 * 60 * 1000))
                    expiry_date = new Date(expiry_date.getTime() + (8 * 60 * 60 * 1000))

                    if (current_date > expiry_date) {
                        ctx.response.status = httpCodes['Not Found']
                        ctx.body = { msg: 'URL Requested Does Not Exist.' }
                        return
                    }
                }
                ctx.response.status = httpCodes['OK']
                ctx.body = { data: result[0].source_url }
            } else { //Short link not found.
                ctx.response.status = httpCodes['Not Found']
                ctx.body = { msg: 'URL Requested Does Not Exist.' }
            }
        },
            (err) => {
                ctx.response.status = httpCodes['Internal Server Error']
                ctx.body = { msg: 'Internal Server Error.' }
            })
})


module.exports = router