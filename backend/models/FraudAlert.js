const mongoose = require("mongoose")

const fraudAlertSchema = new mongoose.Schema({
 userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 category:{
  type:String,
  required:true
 },

 amount:{
  type:Number,
  required:true
 },

 message:{
  type:String
 }

},{timestamps:true})

module.exports = mongoose.model("FraudAlert",fraudAlertSchema)