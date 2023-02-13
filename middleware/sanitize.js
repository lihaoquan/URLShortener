// Input validation/sanitization
const validator = require('validator')

const dotenv = require('dotenv')
const myEnv = dotenv.config()

// Checks if object is a string
let isString = (str) => {
    return Object.prototype.toString.call(str) === '[object String]'
}

// For live server/POSTMAN API testing
const getRequest = ctx => {
    if (process.env.RUNTIME_ENV == 'PROD') {
        return ctx.req
    } else {
        return ctx.request
    }
}

let sanitize = async (ctx, next) => {

    // Sanitize body fields.
    if (getRequest(ctx).body) {

        let keys = Object.keys(getRequest(ctx).body)
        if (keys.length > 0) {
            for (const key of keys) {
                let field = getRequest(ctx).body[key]

                if (Array.isArray(field)) {
                    getRequest(ctx).body[key] = field.map(x => 
                        isString(x) ? validator.escape(x) : x
                    )
                } else if (isString(field)) {
                    getRequest(ctx).body[key] = validator.escape(field)
                }
            }
        }
    }

    // Sanitize query string
    if (getRequest(ctx).query) {
        let keys = Object.keys(getRequest(ctx).query)
        if (keys.length > 0) {
            for (const key of keys) {
                getRequest(ctx).query[key] = validator.escape(getRequest(ctx).query[key])
            }
        }
    }

    await next()
}

module.exports = sanitize