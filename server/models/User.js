import mongoose from 'mongoose'

const { Schema } = mongoose
  const usersSchema = new Schema({
  selectedSectors: {
    type: [String],
  },
})

export default mongoose.model('User', usersSchema)
