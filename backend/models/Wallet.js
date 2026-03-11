const mongoose = require("mongoose")

// const walletSchema = new mongoose.Schema({
//   name: String,
//   members: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   }],
//   balance: {
//     type: Number,
//     default: 0
//   }
// })
const walletSchema = new mongoose.Schema({
  name: String,

  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  members:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],

  balance:{
    type:Number,
    default:0
  }
})

module.exports = mongoose.model("Wallet", walletSchema)