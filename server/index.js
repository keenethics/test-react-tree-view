const restify = require('restify')
const cookieParser = require('restify-cookies')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const winston = require('winston')
const dotenv = require('dotenv')

const util = require('util')
const Sector = require('./models/Sector')
const User = require('./models/User')


const config = dotenv.config({ path: '../.env' }).parsed


const server = restify.createServer({
  name: config.API_NAME,
  version: config.API_VERSION,
})

const date = new Date().toISOString()

const logFormat = winston.format.printf(info => `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}`)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      prettyPrint: true,
      colorize: true,
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }), new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('Database connection established')
  }).catch(err => {
    logger.error(err)
  })

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())
server.use(cookieParser.parse)

const jwtVerifyPromisified = util.promisify(jwt.verify)

const createNewUser = async () => {
  const user = new User({})
  const result = await user.save()
  const signedJWTToken = await jwt.sign({ id: user.id }, config.JWT_SECRET)
  return signedJWTToken
}

server.get('/sectors', async (request, response, next) => {
  const { cookies } = request

  const sectors = await Sector.find()

  const responseData = { sectors }


  if (cookies.jwt) {
    // existing user
    try {
      const userData = await jwtVerifyPromisified(cookies.jwt, config.JWT_SECRET)
      logger.info(`User with id ${userData.id} is trying to get sectors`)

      const user = await User.findById(userData.id)
      responseData.selectedSectors = user.selectedSectors
      response.send(responseData)
      return next()
    } catch (e) {
      logger.error(`${cookies.jwt} - is not valid token`)
    }
  }

  response.setCookie('jwt', await createNewUser())
  response.send(responseData)

  return next()
})

server.post('/save-selectors', async (request, response, next) => {
  try {
    const { ids } = request.body
    const { cookies } = request

    const userData = await jwtVerifyPromisified(cookies.jwt, config.JWT_SECRET)
    const result = await User.findByIdAndUpdate(userData.id, { $set: { selectedSectors: ids } })

    logger.info(ids)
    response.send(ids)
  } catch (e) {
    logger.error(e)
  }

  return next()
})

server.listen(config.PORT, () => {
  logger.info(`${server.name} is listening on ${server.url}`)
})
