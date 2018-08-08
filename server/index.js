const restify = require('restify')
const mongoose = require('mongoose')
const winston = require('winston')
const dotenv = require('dotenv')

const config = dotenv.config().parsed


const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0',
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

logger.info('The app is started')

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('Database connection established')
  }).catch(err => {
    logger.error(err)
  })

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/echo/:name', (req, res, next) => {
  res.send(req.params)
  return next()
})

server.listen(config.PORT, () => {
  logger.info(`Server is listening on ${config.PORT}`)

  console.log('%s listening at %s', server.name, server.url)
})
