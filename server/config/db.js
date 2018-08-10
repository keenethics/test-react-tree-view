import mongoose from 'mongoose'
import dotenv from 'dotenv'
import config from './index'
import logger from './logger'
// import sectors from '../data/sectors.json'
// import Sector from '../models/Sector'

const { MONGO_URI, MONGO_USER, MONGO_PASS } = config

/*
const seedData = (items, parentId) => {
  items.map(async ({ id, name, items: children }) => {
    const sector = new Sector({ id, name, parentId })
    await sector.save()
    if (Array.isArray(children)) {
      seedData(children, id)
    }
  })
}
*/

const connectToRemoteDB = onSuccess => {
  const remoteConfig = dotenv.config({ path: `${__dirname}/../../.env.remote` }).parsed
  const { MONGO_URI: MONGO_URI_REMOTE } = remoteConfig
  mongoose
    .connect(MONGO_URI_REMOTE, {
      useNewUrlParser: true,
    })
    .then(() => {
      logger.info('Database connection established to remote mongodb server')
      onSuccess()
      // seedData(sectors)
    })
    .catch(errRemote => {
      logger.error('Cannot connect to remote mongodb database - Stopping server', errRemote)

      process.exit(1)
    })
}

const connectToDb = onSuccess => {
  mongoose
    .connect(MONGO_URI, {
      user: MONGO_USER,
      pass: MONGO_PASS,
      useNewUrlParser: true,
    })
    .then(() => {
      logger.info('Database connection established to local mongodb server')
      onSuccess()
      // seedData(sectors)
    })
    .catch(err => {
      logger.error('Cannot connect to local mongodb database - Trying remote', err)
      connectToRemoteDB(onSuccess)
    })
}

export const disconnectFromDb = () => {
  mongoose.connection.close()
}

export default connectToDb
