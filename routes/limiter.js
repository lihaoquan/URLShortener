// Rate Limit
const RateLimit = require('koa2-ratelimit').RateLimit

// Generic Feedback to avoid reverse engineering
const GENERIC_MESSAGE = 'Too many requests. Please try again later.'

// Endpoint: /generate
const generateLink = RateLimit.middleware({
    interval: { min: 5 }, // capture requests in 5 minutes window
    delayAfter: 3, // begin slowing down responses after the 3rd request
    timeWait: 1 * 1000, // slow down subsequent responses by 1 second per request
    max: 50, // start blocking after 50 requests
    prefixKey: 'post/generate', // to allow the bdd to Differentiate the endpoint 
    message: GENERIC_MESSAGE,
    messageKey: 'message'
})

module.exports = {
    generateLink
}