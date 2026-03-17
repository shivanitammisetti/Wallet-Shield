const Transaction = require("../models/Transaction")
const Wallet = require("../models/Wallet")
const detectFraud = require("../utils/fraudDetector")
const FraudAlert = require("../models/FraudAlert")
const { classifyExpense } = require("../services/aiService")

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { walletId, description, amount, splitBetween } = req.body
    const userId = req.user.id

    const wallet = await Wallet.findById(walletId)
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" })
    }

    const category = await classifyExpense(description)

    let splitData = []
    if (splitBetween && splitBetween.length > 0) {
      const splitAmount = amount / splitBetween.length
      splitData = splitBetween.map(memberId => ({
        user: memberId,
        amount: splitAmount
      }))
    } else {
      splitData = [{ user: userId, amount: amount }]
    }

    const fraudWarning = await detectFraud(userId, category, amount)
    if (fraudWarning) {
      await FraudAlert.create({ userId, category, amount, message: fraudWarning })
    }

    const transaction = await Transaction.create({
      walletId, userId, description, category, amount,
      isGroupExpense: splitBetween && splitBetween.length > 0,
      splitBetween: splitData
    })

    wallet.balance = wallet.balance - amount
    await wallet.save()

    res.json({ message: "Expense added successfully", category, fraudWarning, transaction })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// Get Transactions
exports.getTransactions = async (req, res) => {
  try {
    const { walletId } = req.query
    const transactions = await Transaction.find({ walletId })
      .populate("userId", "name")
      .populate("splitBetween.user", "name")
    res.json(transactions)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// Filter Transactions
exports.filterTransactions = async (req, res) => {
  try {
    const { category, walletId, startDate, endDate } = req.query
    let filter = { userId: req.user.id }

    if (category) filter.category = category
    if (walletId) filter.walletId = walletId

    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 })

    res.json({ count: transactions.length, transactions })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}




// const Transaction = require("../models/Transaction")
// const Wallet = require("../models/Wallet")
// const detectFraud = require("../utils/fraudDetector")
// const FraudAlert = require("../models/FraudAlert")
// const { classifyExpense } = require("../services/aiService")

// // Add Expense
// exports.addExpense = async (req, res) => {

//   try {

//     const { walletId, description, amount, splitBetween } = req.body
//     const userId = req.user.id

//     const wallet = await Wallet.findById(walletId)

//     if (!wallet) {
//       return res.status(404).json({ message: "Wallet not found" })
//     }

//     // AI category detection
//     const category = await classifyExpense(description)

//     let splitData = []

//     if (splitBetween && splitBetween.length > 0) {

//       const splitAmount = amount / splitBetween.length

//       splitData = splitBetween.map(memberId => ({
//         user: memberId,
//         amount: splitAmount
//       }))

//     } else {

//       splitData = [{
//         user: userId,
//         amount: amount
//       }]

//     }

//     const fraudWarning = await detectFraud(userId, category, amount)

//     if (fraudWarning) {
//       await FraudAlert.create({
//         userId,
//         category,
//         amount,
//         message: fraudWarning
//       })
//     }

//     const transaction = await Transaction.create({
//       walletId,
//       userId,
//       description,
//       category,
//       amount,
//       isGroupExpense: splitBetween && splitBetween.length > 0,
//       splitBetween: splitData
//     })

//     // wallet.balance = wallet.balance - amount
//     wallet.balance = wallet.balance - amount
//     await wallet.save()

//     res.json({
//       message: "Expense added successfully",
//       category,
//       fraudWarning,
//       transaction
//     })

//   } catch (err) {

//     console.error(err)
//     res.status(500).json({ error: "Internal Server Error" })

//   }

// }











// const Transaction = require("../models/Transaction")
// const Wallet = require("../models/Wallet")
// const detectFraud = require("../utils/fraudDetector")
// const FraudAlert = require("../models/FraudAlert")

// // Add Expense
// exports.addExpense = async (req, res) => {
//   try {

//     const { walletId, description, amount, category, splitBetween } = req.body
//     const userId = req.user.id

//     // Find wallet
//     const wallet = await Wallet.findById(walletId)

//     if (!wallet) {
//       return res.status(404).json({ message: "Wallet not found" })
//     }

//     let splitData = []

//     // Group Expense
//     if (splitBetween && splitBetween.length > 0) {

//       const splitAmount = amount / splitBetween.length

//       splitData = splitBetween.map(memberId => ({
//         user: memberId,
//         amount: splitAmount
//       }))

//     } 
//     else {

//       // Individual Expense
//       splitData = [{
//         user: userId,
//         amount: amount
//       }]

//     }

//     // Detect fraud
//     const fraudWarning = await detectFraud(userId, category)

//     // Save fraud alert if detected
//     if (fraudWarning) {
//       await FraudAlert.create({
//         userId,
//         category,
//         amount,
//         message: fraudWarning
//       })
//     }

//     // Create transaction
//     const transaction = await Transaction.create({
//       walletId,
//       userId,
//       description,
//       category,
//       amount,
//       isGroupExpense: splitBetween && splitBetween.length > 0,
//       splitBetween: splitData
//     })

//     // Update wallet balance
//     wallet.balance = wallet.balance + amount
//     await wallet.save()

//     res.json({
//       message: "Expense added successfully",
//       fraudWarning,
//       transaction
//     })

//   } catch (err) {

//     console.error(err)
//     res.status(500).json({ error: "Internal Server Error" })

//   }
// }


// // Get Transactions
// exports.getTransactions = async (req, res) => {

//   try {

//     const { walletId } = req.query

//     const transactions = await Transaction.find({ walletId })
//       .populate("userId", "name")
//       .populate("splitBetween.user", "name")

//     res.json(transactions)

//   } catch (err) {

//     console.error(err)
//     res.status(500).json({ error: "Internal Server Error" })

//   }

// }


// // Filter Transactions
// exports.filterTransactions = async (req, res) => {

//   try {

//     const { category, walletId, startDate, endDate } = req.query

//     let filter = {
//       userId: req.user.id
//     }

//     if (category) {
//       filter.category = category
//     }

//     if (walletId) {
//       filter.walletId = walletId
//     }

//     if (startDate || endDate) {

//       filter.createdAt = {}

//       if (startDate) {
//         filter.createdAt.$gte = new Date(startDate)
//       }

//       if (endDate) {
//         filter.createdAt.$lte = new Date(endDate)
//       }

//     }

//     const transactions = await Transaction
//       .find(filter)
//       .sort({ createdAt: -1 })

//     res.json({
//       count: transactions.length,
//       transactions
//     })

//   } catch (error) {

//     res.status(500).json({ message: error.message })

//   }

// }
