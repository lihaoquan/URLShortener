const Koa = require('koa')
const helmet = require('koa-helmet')

const bodyParser = require('koa-bodyparser')

const dotenv = require('dotenv')
const myEnv = dotenv.config()

const UserRoutes = require('./routes/user.router')

const app = new Koa()

// General security middleware functions
app.use(helmet())

// Sanitize user input
app.use(require('./middleware/sanitize'))

// Parse http request body
app.use(bodyParser({
    jsonLimit: '10mb'
}))

// Routes
app.use(UserRoutes.routes())
app.use(UserRoutes.allowedMethods())

app.listen(process.env.SERVER_PORT)