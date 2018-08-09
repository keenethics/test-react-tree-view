import dotenv from 'dotenv'

const config = dotenv.config({ path: `${__dirname}/../../.env` }).parsed

export default config
