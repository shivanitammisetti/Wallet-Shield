const CategoryLimit = require("../models/CategoryLimit")
const Transaction = require("../models/Transaction")

const detectFraud = async (userId, category) => {

 try {

  // Get category limit set by user
  const limitData = await CategoryLimit.findOne({
   userId,
   category
  })

  if (!limitData) {
   return null
  }

  const limitAmount = limitData.limitAmount

  // Get all transactions of that category for that user
  const transactions = await Transaction.find({
   userId,
   category
  })

  let totalSpent = 0

  transactions.forEach(tx => {
   totalSpent += tx.amount
  })

  if (totalSpent > limitAmount) {
   return `⚠ ${category} spending limit exceeded`
  }

  return null

 } catch (err) {
  console.error(err)
  return null
 }

}

module.exports = detectFraud



// const detectFraud = (amount, transactions, userLimit) => {

//  let warning = null

//  // Rule 1
//  if (amount > userLimit) {
//   warning = "⚠ Expense exceeds your personal limit"
//  }

//  // Rule 2
//  if (amount > 20000) {
//   warning = "⚠ Very large transaction detected"
//  }

//  // Rule 3
//  if (transactions.length > 5) {
//   warning = "⚠ Too many transactions"
//  }

//  return warning
// }

// module.exports = detectFraud




// const detectFraud = (amount, transactions) => {

//  let warning = null

//  // Rule 1: Very large expense
//  if (amount > 20000) {
//   warning = "⚠ Large transaction detected"
//  }

//  // Rule 2: Too many transactions
//  if (transactions.length > 5) {
//   warning = "⚠ Too many transactions in short time"
//  }

//  return warning
// }

// module.exports = detectFraud