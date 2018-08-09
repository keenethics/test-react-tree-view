import mongoose from 'mongoose'
import { arrayMinLength } from '../util/validators'

const { Schema } = mongoose
const MIN_LENGTH = 1
const usersSchema = new Schema({
  userId: String,
  selectedSectors: {
    type: [Number],
    // validate: [arrayMinLength(MIN_LENGTH), `SelectedSectors should be >= ${MIN_LENGTH}`],
  },
})

export default mongoose.model('User', usersSchema)
