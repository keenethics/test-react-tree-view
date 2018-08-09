import util from 'util'
import jwt from 'jsonwebtoken'

import logger from './config/logger'
import config from './config'
import User from './models/User'

const jwtVerifyPromisified = util.promisify(jwt.verify)

const { JWT_SECRET } = config

const getUserFromJwt = async token => {
  let user
  if (token) {
    try {
      const userId = await jwtVerifyPromisified(token, JWT_SECRET)
      if (userId) {
        user = await User.findById(userId)
      }
    } catch (e) {
      logger.error('Unable to validate user token')
    }
  }
  return user
}

const createNewUser = async () => {
  const user = new User({})
  const savedUser = await user.save()
  const { id: userId } = savedUser
  logger.info(`Created new user with id ${userId}`)
  const signedJWTToken = await jwt.sign(userId, config.JWT_SECRET)
  return signedJWTToken
}

export { getUserFromJwt, createNewUser }
