const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bills: { type: String, required: true },
  friends: { type: [String], required: true },
  requested: { type: [String], required: true },
  requests: { type: [String], required: true },
})

module.exports = model('User', userSchema)
