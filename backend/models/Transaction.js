const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({

  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String
  },

  amount: {
    type: Number,
    required: true
  },

  // NEW FIELD
  isGroupExpense: {
    type: Boolean,
    default: false
  },

  // Only used when isGroupExpense = true
  splitBetween: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    amount: Number
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Transaction", transactionSchema)




// const mongoose = require("mongoose")

// const transactionSchema = new mongoose.Schema({
//   walletId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Wallet"
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   description: String,
//   category: String,
//   amount: Number,

//   splitBetween: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     },
//     amount: Number
//   }],

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// })

// module.exports = mongoose.model("Transaction", transactionSchema)