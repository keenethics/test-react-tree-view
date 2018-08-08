const restify = require('restify')
const mongoose = require('mongoose')
const winston = require('winston')
const dotenv = require('dotenv')

const config = dotenv.config({path: '../.env'}).parsed


const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0',
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
  ],
})

const sectorSchema = new mongoose.Schema({
  id: String,
  name: String
});

const Sector = mongoose.model('Sector', sectorSchema);


logger.info('The app is started')

mongoose.connect(config.MONGO_URI, {useNewUrlParser: true})
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

server.listen(config.PORT, () => {
  logger.info(`Server is listening on ${config.PORT}`)

  console.log('%s listening at %s', server.name, server.url)
})
