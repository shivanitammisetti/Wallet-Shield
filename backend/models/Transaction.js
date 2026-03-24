const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true
  },

  description: String,

  category: String,

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["SUCCESS", "FAILED", "FRAUD"],
    default: "SUCCESS"
  },

  type: {
    type: String,
    enum: ["DEBIT", "CREDIT"],
    default: "DEBIT"
  },

  isGroupExpense: {
    type: Boolean,
    default: false
  },

  splitBetween: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      amount: Number
    }
  ]

}, { timestamps: true })

module.exports = mongoose.model("Transaction", transactionSchema)




// const mongoose = require("mongoose")

// const transactionSchema = new mongoose.Schema({

//   walletId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Wallet",
//     required: true
//   },

//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },

//   description: {
//     type: String,
//     required: true
//   },

//   category: {
//     type: String
//   },

//   amount: {
//     type: Number,
//     required: true
//   },

//   // NEW FIELD
//   isGroupExpense: {
//     type: Boolean,
//     default: false
//   },

//   // Only used when isGroupExpense = true
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