const mongoose = require('mongoose')
const {Schema} = mongoose

const selectedSectorsSchema = new Schema({
  userId: String,
  sectors: Array,
})

const SelectedSectors = mongoose.model('SelectedSectors', selectedSectorsSchema)

module.exports = SelectedSectors
