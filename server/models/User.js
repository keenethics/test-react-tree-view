import mongoose from 'mongoose'

const { Schema } = mongoose
const MIN_LENGTH = 1
const usersSchema = new Schema({
  selectedSectors: {
    type: [Number],
  },
})

export default mongoose.model('User', usersSchema)
