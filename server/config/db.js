import mongoose from 'mongoose'

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

mongoose
  .connect(MONGO_URI, {
    user: MONGO_USER,
    pass: MONGO_PASS,
    useNewUrlParser: true,
  })
  .then(() => {
    logger.info('Database connection established')
    // seedData(sectors)
  })
  .catch(err => {
    logger.error(err)
    process.exit(1)
  })
