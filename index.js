const Koa = require('koa')
const helmet = require('koa-helmet')
const cors = require('@koa/cors')

const bodyParser = require('koa-bodyparser')

const dotenv = require('dotenv')
const myEnv = dotenv.config()

const UserRoutes = require('./routes/user.router')

const app = new Koa()

// General security middleware functions
app.use(helmet())

// Enable cross origin access from front end
app.use(cors({
    origins: ['*']   
}))

// Parse http request body
app.use(bodyParser({
    jsonLimit: '10mb'
}))

// Sanitize user input
app.use(require('./middleware/sanitize'))

// Routes
app.use(UserRoutes.routes())
app.use(UserRoutes.allowedMethods())

app.listen(process.env.SERVER_PORT)