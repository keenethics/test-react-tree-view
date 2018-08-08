const mongoose = require('mongoose')
const { Schema } = mongoose

const sectorSchema = new Schema({
  id: String,
  name: String,
})


const Sector = mongoose.model('Sector', sectorSchema)


module.exports = Sector
