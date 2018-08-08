const restify = require('restify')
const mongoose = require('mongoose')
const winston = require('winston')
const dotenv = require('dotenv')

const { Schema } = mongoose

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

const sectorSchema = new Schema({
  id: String,
  name: String,
})

const Sector = mongoose.model('Sector', sectorSchema)

const selectedSectorsSchema = new Schema({
  userId: String,
  sectors: Array,
})

const SelectedSectors = mongoose.model('SelectedSectors', selectedSectorsSchema)


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

server.get('/sectors', (req, res, next) => {
  Sector.find().then(sectors => res.send(sectors)).catch(err => logger.error(err))
  return next()
})

server.post('/selected-sectors', (req, res, next) => {
  try {
    const { ids } = req.body

    const selectedSectors = new SelectedSectors({
      userId: 'uid',
      sectors: ids,
    })

    selectedSectors.save().then(res => logger.info(res)).catch(err => logger.error(err))

    logger.info(ids)
    res.send(ids)
  } catch (e) {
    logger.error(e)
  }

  return next()
})

server.listen(config.PORT, () => {
  logger.info(`${server.name} is listening on ${server.url}`)
})
