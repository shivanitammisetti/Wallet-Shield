const mongoose = require("mongoose")

const categoryLimitSchema = new mongoose.Schema({

 userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
 },

 category: {
  type: String,
  required: true
 },

 limitAmount: {
  type: Number,
  required: true
 }

})

module.exports = mongoose.model("CategoryLimit", categoryLimitSchema)