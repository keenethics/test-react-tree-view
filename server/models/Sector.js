import mongoose from 'mongoose'

const { Schema } = mongoose

const sectorSchema = new Schema({
  id: String,
  name: String,
  parentId: String,
})


export default mongoose.model('Sector', sectorSchema)
