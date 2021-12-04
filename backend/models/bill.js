const { Schema, model } = require('mongoose')

const billSchema = new Schema({
  name: { type: String, required: true },
  host: { type: String, required: true },
  members: {
    type: Map,
    of: {
      items: { type: [String], required: true },
    },
    required: true,
  },
  items: {
    type: Map,
    of: {
      members: { type: [String], required: true },
      price: { type: Number, required: true },
      taxed: { type: Boolean, required: true },
    },
    required: true,
  },
})

module.exports = model('Bill', billSchema)
