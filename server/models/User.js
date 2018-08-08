const mongoose = require('mongoose')

const { Schema } = mongoose

const usersSchema = new Schema({
  userId: String,
  selectedSectors: Array,
})

const User = mongoose.model('User', usersSchema)

module.exports = User
