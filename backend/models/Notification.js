const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  message: String,

  type: {
    type: String,
    enum: ["transaction", "fraud", "system"]
  },

  // ✅ FIXED (comma added above)
  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)




// const mongoose = require("mongoose")

// const notificationSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   message: String,

//   type: {
//     type: String,
//     enum: ["transaction", "fraud", "system"]
//   }

//   isRead: {
//   type: Boolean,
//   default: false
// }

// }, { timestamps: true })

// module.exports = mongoose.model("Notification", notificationSchema)