const mongoose = require("mongoose")

const walletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  limit: {
    type: Number,
    default: 0
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  balance: {
    type: Number,
    default: 0
  }

}, { timestamps: true })

module.exports = mongoose.model("Wallet", walletSchema)





// const mongoose = require("mongoose")

// const walletSchema = new mongoose.Schema({
//   name: String,

//   owner:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref:"User"
//   },

//   members:[{
//     type: mongoose.Schema.Types.ObjectId,
//     ref:"User"
//   }],

//   balance:{
//     type:Number,
//     default:0
//   }
// })

// module.exports = mongoose.model("Wallet", walletSchema)