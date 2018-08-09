import mongoose from 'mongoose'

const { Schema } = mongoose

const usersSchema = new Schema({
  userId: String,
  selectedSectors: Array,
})

export default mongoose.model('User', usersSchema)
