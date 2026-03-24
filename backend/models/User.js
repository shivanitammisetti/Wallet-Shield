const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,

  phone: {
    type: String,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String
  },

  // ✅ ADD THIS (IMPORTANT FIX)
  otpExpires: {
    type: Date
  },

  balance: {
    type: Number,
    default: 0
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)





// const mongoose = require("mongoose")

// const userSchema = new mongoose.Schema({
//   name: String,

//   email: {
//     type: String,
//     unique: true
//   },

//   password: String,

//   phone: {
//     type: String,
//     required: true
//   },

//   isVerified: {
//     type: Boolean,
//     default: false
//   },

//   otp: String,

//   balance: {
//     type: Number,
//     default: 0
//   },

//   isProfileComplete: {
//   type: Boolean,
//   default: false
// }

// }, { timestamps: true })

// module.exports = mongoose.model("User", userSchema)



// const mongoose = require("mongoose")

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: {
//     type: String,
//     unique: true
//   },
//   password: String
// })

// module.exports = mongoose.model("User", userSchema)