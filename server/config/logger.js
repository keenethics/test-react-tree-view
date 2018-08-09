import winston from 'winston'

const date = new Date().toISOString()

const logFormat = winston.format.printf(
  info => `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}`,
)

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      prettyPrint: true,
      colorize: true,
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

module.exports = logger
